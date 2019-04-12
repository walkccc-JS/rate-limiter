import React, { Component } from 'react';

class Timer extends Component {
  constructor(props) {
    super();
    const { seconds } = props;
    const timeObj = this.secondsToTime(seconds);
    this.state = { seconds, timeObj };
  }

  secondsToTime = secs => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.ceil((secs % 3600) % 60);

    return { h, m, s };
  };

  componentWillMount = () => this.startTimer();

  startTimer = () => {
    if (this.state.seconds > 0) setInterval(this.countDown, 1000);
  };

  countDown = () => {
    const seconds = this.state.seconds - 1;

    this.setState({ seconds, timeObj: this.secondsToTime(seconds) });
  };

  render() {
    return (
      <em>
        {this.state.timeObj.m} mins {this.state.timeObj.s} secs
      </em>
    );
  }
}

export default Timer;
