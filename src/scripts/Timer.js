export default class Timer {
  constructor(secondsLeft, minutesLeft, hoursLeft) {
    this.secondsLeft = secondsLeft;
    this.minutesLeft = minutesLeft;
    this.hoursLeft = hoursLeft;
    this.isRunning = false;
    this.isStarted = false;
    this.startTime = NaN;
  }

  start() {
    if (!this.isStarted && !this.isRunning) {
      this.isStarted = true;
      this.isRunning = true;
      this.startTime = Math.round(Date.now() / 1000);
      this.interval = setInterval(this.interval);
    }
  }

  stop() {
    if (this.isStarted && this.isRunning) {
      clearInterval(this.interval);
    }
  }
}
