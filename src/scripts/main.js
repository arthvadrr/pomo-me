const $timer = document.getElementById("timer");
const $start = document.getElementById("start");
const $stop = document.getElementById("stop");
let isRunning = false;
let dateStarted;
let delta;
let countdown = () => {};

let startTime = 30;
let remainingTime = 30;
let currentDelta;

const adjustTime = (delta) => {
    const res = startTime - delta;

    if (res === 0) {
        delta = 0;
    }

    return startTime - delta;
};

const onStart = () => {
    if (!isRunning) {
        isRunning = true;
        $start.innerHTML = "Pause";
        dateStarted = Date.now();
        countdown = setInterval(() => {
            delta = Math.round((Date.now() - dateStarted) / 1000);
            remainingTime = adjustTime(delta);
            $timer.innerHTML = remainingTime.toString();
            if (remainingTime === 0) {
                clearInterval(countdown);
                return;
            }
        }, 100);
    } else {
        isRunning = false;
        $start.innerHTML = "Start";
        startTime = remainingTime;
        clearInterval(countdown);
    }
};

$start.addEventListener("click", onStart);
