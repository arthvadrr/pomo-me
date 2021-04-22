/*
# Complaints/ TODO Refactor
## Utilize state
## Refactor to class
## Purify functions
## MVC refactor. MVC can be fully deployed here
*/

const $pomoTimer = document.getElementsByClassName("pomo-timer")[0];
const $timer = document.getElementById("timer");
const $start = document.getElementById("start");
const $reset = document.getElementById("reset");
const $shortBreak = document.getElementById("shortBreak");
const $longBreak = document.getElementById("longBreak");
const $increaseTime = document.getElementById("increaseTime");
const $decreaseTime = document.getElementById("decreaseTime");
const $progressBar = document.getElementById("progressBar");
let isActive = false;
let dateStarted;
let delta;
let strokeDashArrayOffset;
let startHidden = false;
let pomoState = "init";

//JS or linter bug resulting in type error. TODO Investigate why I'm having to explicitly force type inference.
let countdown = () => {};

let originalTime = 5;
let startTime = originalTime;
let remainingTime = originalTime;
let currentDelta;

const setPomoState = state => {
    $pomoTimer.classList.remove("init");
    $pomoTimer.classList.remove("break");
    $pomoTimer.classList.remove("finished");
    $pomoTimer.classList.remove("paused");
    $pomoTimer.classList.remove("active");
    $pomoTimer.classList.remove("break-active");

    switch (state) {
        case "init":
            $pomoTimer.classList.add("init");
            break;
        case "break":
            $pomoTimer.classList.add("break");
            break;
        case "finished":
            $pomoTimer.classList.add("finished");
            break;
        case "paused":
            $pomoTimer.classList.add("paused");
            break;
        case "active":
            $pomoTimer.classList.add("active");
            break;
        case "break-active":
            $pomoTimer.classList.add("break-active");
            break;
        default:
            return;
    }
};

const formatTime = seconds => {
    let formattedTime;
    let minutes = Math.floor(seconds / 60);

    let fseconds = seconds % 60;
    let fminutes = minutes % 60;

    if (minutes >= 60) {
        fminutes = 60;
        fseconds = 0;
    }

    const addLeadingZero = int => (int < 10 ? `0${int}` : int);

    fseconds = addLeadingZero(fseconds);
    fminutes = addLeadingZero(fminutes);

    formattedTime = `${fminutes}:${fseconds}`;

    return formattedTime;
};

const printTimer = print => {
    $timer.innerHTML = print;
    $progressBar.style.strokeDashoffset = updateStrokeDashArrayOffset();
};

const updateStrokeDashArrayOffset = () => {
    if (remainingTime !== 0) {
        let adjStart = originalTime - 1;
        let adjRemaining = remainingTime - 1;

        return 565.48 - (565.48 * adjRemaining) / adjStart;
    }
    return 565.48;
};

const adjustTime = delta => {
    const res = startTime - delta;

    if (res === 0) {
        delta = 0;
        return 0;
    }

    return startTime - delta;
};

const onReset = () => {
    onStop();
    if (startHidden) {
        $start.removeAttribute("disabled", true);
    }
    isActive = false;
    $start.innerHTML = "Start";
    $start.setAttribute("aria-pressed", false);
    startTime = originalTime;
    remainingTime = originalTime;
    printTimer(formatTime(remainingTime));
    pomoState = "init";
    setPomoState(pomoState);
};

const onTimerZero = () => {
    startHidden = true;
    $start.setAttribute("disabled", true);
    pomoState = "finished";
    setPomoState(pomoState);
};

const onStop = () => {
    isActive = false;
    $start.innerHTML = "Start";
    $start.setAttribute("aria-pressed", false);
    clearInterval(countdown);

    if (remainingTime === 0) {
        onTimerZero();
    } else {
        startTime = remainingTime;
        pomoState = "paused";
        setPomoState(pomoState);
    }
};

const onStart = () => {
    pomoState = pomoState === "break" ? "break-active" : "active";
    setPomoState(pomoState);

    if (!isActive) {
        isActive = true;
        $start.innerHTML = "Pause";
        $start.setAttribute("aria-pressed", true);
        dateStarted = Date.now();

        countdown = setInterval(() => {
            delta = Math.round((Date.now() - dateStarted) / 1000);
            remainingTime = adjustTime(delta);
            printTimer(formatTime(remainingTime));
            if (remainingTime === 0) {
                onStop();
            }
        }, 100);
    } else if (remainingTime !== 0) {
        onStop();
    }
};

const onIncreaseTime = () => {
    isActive = false;
    clearInterval(countdown);
    $start.innerHTML = "Start";
    $start.setAttribute("aria-pressed", false);

    if (startTime <= 3300) {
        startTime += 300;
    } else {
        startTime = 3600;
    }

    remainingTime = startTime;
    originalTime = startTime;
    printTimer(formatTime(startTime));
};

const onDecreaseTime = () => {
    isActive = false;
    clearInterval(countdown);
    $start.innerHTML = "Start";
    $start.setAttribute("aria-pressed", false);

    if (startTime >= 600) {
        startTime -= 300;
    } else {
        startTime = 300;
    }

    remainingTime = startTime;
    originalTime = startTime;
    printTimer(formatTime(startTime));
};

const onShortBreak = () => {
    isActive = false;
    clearInterval(countdown);
    $start.innerHTML = "Start";
    $start.setAttribute("aria-pressed", false);
    startTime = 300;
    remainingTime = startTime;
    originalTime = startTime;
    printTimer(formatTime(startTime));
    pomoState = "break";
    setPomoState("break");
};

const onLongBreak = () => {
    isActive = false;
    clearInterval(countdown);
    $start.innerHTML = "Start";
    $start.setAttribute("aria-pressed", false);
    startTime = 900;
    remainingTime = startTime;
    originalTime = startTime;

    printTimer(formatTime(startTime));
    pomoState = "break";
    setPomoState(pomoState);
};

$start.addEventListener("click", onStart);
$reset.addEventListener("click", onReset);
$shortBreak.addEventListener("click", onShortBreak);
$longBreak.addEventListener("click", onLongBreak);
$increaseTime.addEventListener("click", onIncreaseTime);
$decreaseTime.addEventListener("click", onDecreaseTime);
printTimer(formatTime(remainingTime));
