import React, { Component } from 'react';

import './index.scss';

export class BottomBar extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    prefixCls: React.PropTypes.string,
    size: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'bottom-bar',
    size: 'medium',
  };

  render() {
    const { prefixCls, size, children } = this.props;
    return (
      <div className={`${prefixCls}-wrapper ${prefixCls}-${size}`}>
        <div className={`has-${prefixCls}`} ></div>
        <div className={`${prefixCls} text-center`} >
          {children}
        </div>
      </div>
    );
  }
}
