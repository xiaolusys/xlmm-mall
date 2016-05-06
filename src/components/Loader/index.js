import React, { Component } from 'react';

import './index.scss';

export class Loader extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    size: React.PropTypes.string,
    color: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'fading-circle',
    size: 'medium',
    color: 'yellow',
  }

  render() {
    const { prefixCls, size, color } = this.props;
    return (
      <div className={`${prefixCls} ${prefixCls}-${size} ${prefixCls}-${color}`}>
        <div className="circle-1 circle"></div>
        <div className="circle-2 circle"></div>
        <div className="circle-3 circle"></div>
        <div className="circle-4 circle"></div>
        <div className="circle-5 circle"></div>
        <div className="circle-6 circle"></div>
        <div className="circle-7 circle"></div>
        <div className="circle-8 circle"></div>
        <div className="circle-9 circle"></div>
        <div className="circle-10 circle"></div>
        <div className="circle-11 circle"></div>
        <div className="circle-12 circle"></div>
      </div>
    );
  }
}
