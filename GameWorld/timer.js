class Timer {
    constructor() {
      this.clearTime = null;
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;
      this.secs = '00';
      this.mins = '00:';
      this.gethours = '00:';
    }
  
    startWatch() {
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes++;
      }
  
      this.mins = this.minutes < 10 ? '0' + this.minutes + ':' : this.minutes + ':';
  
      if (this.minutes === 60) {
        this.minutes = 0;
        this.hours++;
      }
  
      this.gethours = this.hours < 10 ? '0' + this.hours + ':' : this.hours + ':';
      this.secs = this.seconds < 10 ? '0' + this.seconds : this.seconds;
  
      // Display the Count-Up Timer
      const x = document.getElementById('timer');
      x.innerHTML = this.gethours + this.mins + this.secs;
  
      this.seconds++;
      this.clearTime = setTimeout(() => this.startWatch(), 1000);
    }
  
    startTime() {
      if (this.seconds === 0 && this.minutes === 0 && this.hours === 0) {
        // Hide the fulltime when the Count-Up is running
        const fulltime = document.getElementById('fulltime');
        fulltime.style.display = 'block';
  
        // Call the startWatch() function to execute the Count-Up
        this.startWatch();
      }
    }
  
    stopTime() {
      if (this.seconds !== 0 || this.minutes !== 0 || this.hours !== 0) {
        const fulltime = document.getElementById('fulltime');
        const fulltimetwo = document.getElementById('fulltimetwo');
        fulltime.innerHTML = 'Congratulations you completed this level in ' + this.gethours + this.mins + this.secs;
        fulltimetwo.innerHTML = 'Time Recorded is ' + this.gethours + this.mins + this.secs;

        // Reset the Count-Up
        this.seconds = 0;
        this.minutes = 0;
        this.hours = 0;
        this.secs = '0' + this.seconds;
        this.mins = '0' + this.minutes + ': ';
        this.gethours = '0' + this.hours + ': ';
  
        // Display the Count-Up Timer after it's been stopped
        const x = document.getElementById('timer');
        const stopTime = this.gethours + this.mins + this.secs;
        x.innerHTML = stopTime;
  
        // Clear the Count-Up using the setTimeout() return value 'clearTime' as ID
        clearTimeout(this.clearTime);
      }
    }

  }
  
  //const timer = new CountUpTimer();

  export default Timer;
  
  