/*
# Complaints/ TODO Refactor
## Utilize state
## Refactor to class
## Purify functions
## MVC refactor. MVC can be fully deployed here
## Organize Variables
*/

import { $elements, state } from './global_variables';

const setPomoState = state => {
    //TODO Add array of all states and iterate
    let stateMessage = 'Ready';

    $elements.pomoTimer.classList.remove('init');
    $elements.pomoTimer.classList.remove('break');
    $elements.pomoTimer.classList.remove('finished');
    $elements.pomoTimer.classList.remove('paused');
    $elements.pomoTimer.classList.remove('active');
    $elements.pomoTimer.classList.remove('break-active');
    $elements.pomoTimer.classList.remove('break-paused');

    switch (state) {
        case 'init':
            $elements.pomoTimer.classList.add('init');
            stateMessage = 'Ready';
            $elements.audioTicking.pause();
            break;
        case 'break':
            $elements.pomoTimer.classList.add('break');
            stateMessage = 'Break Time!';
            $elements.audioTicking.pause();
            break;
        case 'finished':
            $elements.pomoTimer.classList.add('finished');
            stateMessage = `Time's up!`;
            $elements.audioTicking.pause();
            break;
        case 'paused':
            $elements.pomoTimer.classList.add('paused');
            stateMessage = 'Paused';
            $elements.audioTicking.pause();
            break;
        case 'active':
            $elements.pomoTimer.classList.add('active');
            stateMessage = 'Active';
            $elements.audioTicking.play();
            break;
        case 'break-active':
            $elements.pomoTimer.classList.add('break-active');
            stateMessage = 'Break started!';
            $elements.audioTicking.play();
            break;
        case 'break-paused':
            $elements.pomoTimer.classList.add('break-paused');
            stateMessage = 'Paused';
            $elements.audioTicking.pause();
            break;
        default:
            $elements.audioTicking.pause();
            stateMessage = 'Ready';
            return;
    }

    createStateElement(stateMessage);
};

const createStateElement = state => {
    while ($elements.stateView.firstChild) {
        $elements.stateView.removeChild($elements.stateView.firstChild);
    }

    const $newState = document.createElement('div');
    const $stateText = document.createTextNode(state);
    $newState.appendChild($stateText);
    $elements.stateView.appendChild($newState);
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
    $elements.timer.innerHTML = print;
    $elements.progressBar.style.strokeDashoffset = updateStrokeDashArrayOffset();
};

const updateStrokeDashArrayOffset = () => {
    if (state.remainingTime !== 0) {
        let adjStart = state.originalTime - 1;
        let adjRemaining = state.remainingTime - 1;

        return 565.48 - (565.48 * adjRemaining) / adjStart;
    }
    return 565.48;
};

const adjustTime = delta => {
    const res = state.startTime - delta;

    if (res === 0) {
        delta = 0;
        return 0;
    }

    return state.startTime - delta;
};

const onReset = () => {
    if (state.startHidden) {
        $elements.start.removeAttribute('disabled', true);
    }
    state.isActive = false;
    $elements.start.innerHTML = 'Start';
    $elements.start.setAttribute('aria-pressed', false);
    state.startTime = state.originalTime;
    state.remainingTime = state.originalTime;
    clearInterval(state.countDown);
    printTimer(formatTime(state.remainingTime));
    state.pomoState = 'init';
    setPomoState(state.pomoState);
};

const onTimerZero = () => {
    state.startHidden = true;
    $elements.start.setAttribute('disabled', true);
    state.pomoState = 'finished';
    setPomoState(state.pomoState);
    if (!state.muteNotifications) {
        $elements.audioTimesUp.play();
    }
};

const onStop = () => {
    if (state.pomoState === 'break-active') {
        state.pomoState = 'break-paused';
    } else {
        state.pomoState = 'paused';
    }
    setPomoState(state.pomoState);

    state.isActive = false;
    $elements.start.innerHTML = 'Start';
    $elements.start.setAttribute('aria-pressed', false);
    clearInterval(state.countDown);

    if (state.remainingTime === 0) {
        onTimerZero();
    } else {
        state.startTime = state.remainingTime;
    }
};

const onStart = () => {
    if (!state.isActive) {
        if (state.pomoState === 'break' || state.pomoState === 'break-paused') {
            state.pomoState = 'break-active';
        } else {
            state.pomoState = 'active';
        }
        setPomoState(state.pomoState);

        state.isActive = true;
        $elements.start.innerHTML = 'Pause';
        $elements.start.setAttribute('aria-pressed', true);
        state.dateStarted = Date.now();

        state.countDown = setInterval(() => {
            state.delta = Math.round((Date.now() - state.dateStarted) / 1000);
            state.remainingTime = adjustTime(state.delta);
            printTimer(formatTime(state.remainingTime));
            if (state.remainingTime === 0) {
                onStop();
            }
        }, 100);
    } else if (state.remainingTime !== 0) {
        onStop();
    }
};

const onIncreaseTime = () => {
    state.isActive = false;
    clearInterval(state.countDown);
    $elements.start.innerHTML = 'Start';
    $elements.start.setAttribute('aria-pressed', false);

    if (state.startTime <= 3300) {
        state.startTime += 300;
    } else {
        state.startTime = 3600;
    }

    state.remainingTime = state.startTime;
    state.originalTime = state.startTime;
    printTimer(formatTime(state.startTime));
    state.pomoState = 'init';
    setPomoState(state.pomoState);
};

const onDecreaseTime = () => {
    state.isActive = false;
    clearInterval(state.countDown);
    $elements.start.innerHTML = 'Start';
    $elements.start.setAttribute('aria-pressed', false);

    if (state.startTime >= 600) {
        state.startTime -= 300;
    } else {
        state.startTime = 300;
    }

    state.remainingTime = state.startTime;
    state.originalTime = state.startTime;
    printTimer(formatTime(state.startTime));
    state.pomoState = 'init';
    setPomoState(state.pomoState);
};

const onShortBreak = () => {
    onReset();
    state.isActive = false;
    clearInterval(state.countDown);
    $elements.start.innerHTML = 'Start';
    $elements.start.setAttribute('aria-pressed', false);
    state.startTime = 300;
    state.remainingTime = state.startTime;
    state.originalTime = state.startTime;
    printTimer(formatTime(state.startTime));
    state.pomoState = 'break';
    setPomoState(state.pomoState);
};

const onLongBreak = () => {
    onReset();
    state.isActive = false;
    clearInterval(state.countDown);
    $elements.start.innerHTML = 'Start';
    $elements.start.setAttribute('aria-pressed', false);
    state.startTime = 900;
    state.remainingTime = state.startTime;
    state.originalTime = state.startTime;

    printTimer(formatTime(state.startTime));
    state.pomoState = 'break';
    setPomoState(state.pomoState);
};

(function() {
    onReset();
    printTimer(formatTime(state.remainingTime));

    // Timer Event Listeners
    $elements.start.addEventListener('click', onStart);
    $elements.reset.addEventListener('click', onReset);
    $elements.shortBreak.addEventListener('click', onShortBreak);
    $elements.longBreak.addEventListener('click', onLongBreak);
    $elements.increaseTime.addEventListener('click', onIncreaseTime);
    $elements.decreaseTime.addEventListener('click', onDecreaseTime);
})();
