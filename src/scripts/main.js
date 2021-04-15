/*
# Complaints/ TODO Refactor
## Utilize state
## Refactor to class
## Purify functions
## MVC refactor. MVC can be fully deployed here
*/

const $timer = document.getElementById("timer");
const $start = document.getElementById("start");
const $reset = document.getElementById("reset");
const $increaseTime = document.getElementById("increaseTime");
const $decreaseTime = document.getElementById("decreaseTime");
let isRunning = false;
let dateStarted;
let delta;

//JS or linter bug resulting in type error. TODO Investigate why I'm having to explicitly force type inference.
let countdown = () => {};

let originalTime = 1500;
let startTime = originalTime;
let remainingTime = originalTime;
let currentDelta;

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
    $start.setAttribute("aria-pressed", false);
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
        $start.setAttribute("aria-pressed", true);
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

const onIncreaseTime = () => {
    isRunning = false;
    clearInterval(countdown);
    $start.innerHTML = "Start";
    $start.setAttribute("aria-pressed", false);

    if (startTime <= 3300) {
        startTime += 300;
    } else {
        startTime = 3600;
    }
    printTimer(formatTime(startTime));
};

const onDecreaseTime = () => {
    isRunning = false;
    clearInterval(countdown);
    $start.innerHTML = "Start";
    $start.setAttribute("aria-pressed", false);

    if (startTime >= 600) {
        startTime -= 300;
        printTimer(formatTime(startTime));
    }
};

$start.addEventListener("click", onStart);
$reset.addEventListener("click", onReset);
$increaseTime.addEventListener("click", onIncreaseTime);
$decreaseTime.addEventListener("click", onDecreaseTime);
printTimer(formatTime(remainingTime));

async function getRes() {
    let url =
        "https://api.github.com/repos/javascript-tutorial/en.javascript.info/commits";
    let response = await fetch(url);

    let commits = await response.json(); // read response body and parse as JSON
    console.log(commits);
    console.log(commits[0].author.login);
}
getRes();
