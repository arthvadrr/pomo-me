import { $elements, state } from './global_variables';

const onChangeMuteElements = e => {
    const $eleId = e.target.id;

    switch ($eleId) {
        case 'mute-ticking':
            onMuteTicking(e);
            break;
        case 'mute-button-presses':
            onMuteButtonPress(e);
            break;
        case 'mute-times-up':
            onMuteTimesUp(e);
            break;
        case 'mute-all':
            onMuteAll(e);
            break;
        default:
            return undefined;
    }
};

const CB_checkMuteAll = e => {
    if (state.muteTicking && state.muteButtonPresses && state.muteTimesUp) {
        $elements.muteAll.checked = true;
    } else if ($elements.muteAll.checked) {
        $elements.muteAll.checked = false;
    }
};

const onMuteTicking = e => {
    if (e.target.checked) {
        state.muteTicking = true;
        $elements.audioTicking.muted = true;
    } else {
        state.muteTicking = false;
        $elements.audioTicking.muted = false;
    }

    CB_checkMuteAll(e);
};

const onMuteButtonPress = e => {
    if (e.target.checked) {
        state.muteButtonPresses = true;
        $elements.audioButtonPress.muted = true;
    } else {
        state.muteButtonPresses = false;
        $elements.audioButtonPress.muted = false;
    }

    CB_checkMuteAll(e);
};
const onMuteTimesUp = e => {
    if (e.target.checked) {
        state.muteTimesUp = true;
        $elements.audioTimesUp.muted = true;
    } else {
        state.muteTimesUp = false;
        $elements.audioTimesUp.muted = false;
    }

    CB_checkMuteAll(e);
};

const onMuteAll = e => {
    if (e.target.checked) {
        state.muteTicking = true;
        state.muteButtonPresses = true;
        state.muteTimesUp = true;

        $elements.muteButtonPresses.checked = true;
        $elements.muteTickingButton.checked = true;
        $elements.muteTimesUp.checked = true;

        $elements.audioTicking.muted = true;
        $elements.audioButtonPress.muted = true;
        $elements.audioTimesUp.muted = true;
    } else {
        state.muteTicking = false;
        state.muteButtonPresses = false;
        state.muteTimesUp = false;

        $elements.muteButtonPresses.checked = false;
        $elements.muteTickingButton.checked = false;
        $elements.muteTimesUp.checked = false;

        $elements.audioTicking.muted = false;
        $elements.audioButtonPress.muted = false;
        $elements.audioTimesUp.muted = false;
    }

    CB_checkMuteAll(e);
};

const onTickingVolumeChange = e => {
    const volumeLevel = e.target.value;

    if (volumeLevel) {
        $elements.tickingVolume.value = volumeLevel;
        $elements.audioTicking.volume = volumeLevel;
    }
};

const onButtonVolumeChange = e => {
    const volumeLevel = e.target.value;

    if (volumeLevel) {
        $elements.buttonVolume.value = volumeLevel;
        $elements.audioButtonPress.volume = volumeLevel;
    }
};

const onTimesUpVolumeChange = e => {
    const volumeLevel = e.target.value;

    if (volumeLevel) {
        $elements.timesUpVolume.value = volumeLevel;
        $elements.audioTimesUp.volume = volumeLevel;
    }
};

const onMasterVolumeChange = e => {
    const volumeLevel = e.target.value;

    if (volumeLevel) {
        $elements.audioTimesUp.volume = volumeLevel;
        $elements.timesUpVolume.value = volumeLevel;

        $elements.audioTicking.volume = volumeLevel;
        $elements.tickingVolume.value = volumeLevel;

        $elements.audioButtonPress.volume = volumeLevel / 2;
        $elements.buttonVolume.value = volumeLevel;
    }
};

const playAudioButtonPress = () => $elements.audioButtonPress.play();

(function() {
    $elements.audioButtonPress.volume = 0.5;

    // Audio control onclicks
    $elements.muteTickingButton.addEventListener('click', onMuteTicking);
    $elements.tickingVolume.addEventListener('change', onTickingVolumeChange);
    $elements.buttonVolume.addEventListener('change', onButtonVolumeChange);
    $elements.timesUpVolume.addEventListener('change', onTimesUpVolumeChange);
    $elements.masterVolume.addEventListener('change', onMasterVolumeChange);
    $elements.muteTimesUp.addEventListener('click', onChangeMuteElements);
    $elements.muteButtonPresses.addEventListener('click', onChangeMuteElements);
    $elements.muteAll.addEventListener('click', onChangeMuteElements);

    // Adding Click audio to button onclicks
    $elements.start.addEventListener('click', playAudioButtonPress);
    $elements.reset.addEventListener('click', playAudioButtonPress);
    $elements.shortBreak.addEventListener('click', playAudioButtonPress);
    $elements.longBreak.addEventListener('click', playAudioButtonPress);
    $elements.increaseTime.addEventListener('click', playAudioButtonPress);
    $elements.decreaseTime.addEventListener('click', playAudioButtonPress);
    $elements.muteTickingButton.addEventListener('click', playAudioButtonPress);
    $elements.muteTimesUp.addEventListener('click', playAudioButtonPress);
    $elements.muteAll.addEventListener('click', playAudioButtonPress);
})();
