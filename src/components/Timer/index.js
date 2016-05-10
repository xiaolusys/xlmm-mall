import React, { Component } from 'react';
import classnames from 'classnames';
import * as utils from 'utils';

export class Timer extends Component {

  static propTypes = {
    endDate: React.PropTypes.string.isRequired,
  }

  state = {
    remaining: null,
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    const { endDate } = this.props;
    const remaining = utils.timer.getTimeRemaining(new Date(endDate));
    if (remaining.totals > 0) {
      this.setState({ remaining: remaining.days + ':' + remaining.hours + ':' + remaining.minutes + ':' + remaining.seconds });
    } else {
      this.setState({ remaining: '已结束' });
      clearInterval(this.interval);
    }

  }

  render() {
    return (
      <span {...this.props}>{this.state.remaining}</span>
    );
  }
}
