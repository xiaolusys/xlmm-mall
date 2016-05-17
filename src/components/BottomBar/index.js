import React, { Component } from 'react';

import './index.scss';

export class BottomBar extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    prefixCls: React.PropTypes.string,
    className: React.PropTypes.string,
    size: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'bottom-bar',
    className: '',
    size: 'medium',
  };

  render() {
    const { prefixCls, size, children, className } = this.props;
    return (
      <div className={`${prefixCls}-wrapper ${prefixCls}-${size} ${className}`}>
        <div className={`has-${prefixCls}`} ></div>
        <div className={`${prefixCls} top-border text-center`} >
          {children}
        </div>
      </div>
    );
  }
}
