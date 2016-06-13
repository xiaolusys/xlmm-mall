import React, { Component } from 'react';
import classnames from 'classnames';
import * as utils from 'utils';

export class Timer extends Component {

  static propTypes = {
    endDateString: React.PropTypes.string.isRequired,
    format: React.PropTypes.string,
    hasBeenEnd: React.PropTypes.string,
  };

  static defaultProps = {
    format: 'dd天hh时mm分ss秒',
    hasBeenEnd: '已结束',
  };

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
    const { endDateString, hasBeenEnd } = this.props;
    const remaining = utils.timer.getTimeRemaining(endDateString);
    if (remaining.totals > 0) {

      this.setState({ remaining: this.format(remaining) });
    } else {
      this.setState({ remaining: hasBeenEnd });
      clearInterval(this.interval);
    }
  }

  format(remaining) {
    let { format } = this.props;
    format = format.replace('dd', remaining.days);
    format = format.replace('hh', remaining.hours);
    format = format.replace('mm', remaining.minutes);
    format = format.replace('ss', remaining.seconds);
    return format;
  }

  render() {
    return (
      <span {...this.props}>{this.state.remaining}</span>
    );
  }
}
