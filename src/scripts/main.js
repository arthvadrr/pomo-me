const $timer = document.getElementById("timer");
const $start = document.getElementById("start");
const $reset = document.getElementById("reset");
let isRunning = false;
let dateStarted;
let delta;
let countdown = () => {};

let originalTime = 36000000000;
let startTime = originalTime;
let remainingTime = originalTime;
let currentDelta;

const formatTime = seconds => {
    let formattedTime;
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    let fseconds = seconds % 60;
    let fminutes = minutes % 60;
    let fhours = hours % 99;

    const addLeadingZero = int => (int < 10 ? `0${int}` : int);

    if (fhours > 99) {
        fhours = 99;
    }

    fseconds = addLeadingZero(fseconds);
    fminutes = addLeadingZero(fminutes);
    fhours = addLeadingZero(fhours);

    formattedTime = `${fhours}:${fminutes}:${fseconds}`;

    return formattedTime;
};

const printTimer = print => ($timer.innerHTML = print);

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
    $start.removeAttribute("disabled", true);
    startTime = originalTime;
    remainingTime = originalTime;
    printTimer(formatTime(remainingTime));
};

const onStop = () => {
    isRunning = false;
    $start.innerHTML = "Start";
    clearInterval(countdown);
    startTime = remainingTime;
    console.log(remainingTime);

    if (remainingTime === 0) {
        $start.setAttribute("disabled", true);
    }
};

const onStart = () => {
    if (!isRunning) {
        if (remainingTime === 0) {
            remainingTime = startTime;
        }

        isRunning = true;
        $start.innerHTML = "Pause";
        dateStarted = Date.now();

        countdown = setInterval(() => {
            delta = Math.round((Date.now() - dateStarted) / 1000);
            remainingTime = adjustTime(delta);
            printTimer(formatTime(remainingTime));
            console.log(remainingTime);
            if (remainingTime === 0) {
                onStop();
            }
        }, 100);
    } else if (remainingTime != 0) {
        onStop();
    }
};

$start.addEventListener("click", onStart);
$reset.addEventListener("click", onReset);
printTimer(formatTime(remainingTime));
