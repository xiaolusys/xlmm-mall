import React, { Component } from 'react';

import './index.scss';

export default class ReseauCircle extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    size: React.PropTypes.string,
    color: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'reseau-circle',
    size: 'medium',
    color: 'yellow',
  }

  render() {
    const { prefixCls, size, color } = this.props;
    return (
      <div className={`${prefixCls} ${prefixCls}-${size} ${prefixCls}-${color}`}>
        <i className="icon-loader icon-spinner-reverse"></i>
        <i className="icon-loader-bottom loader-bottom"></i>
      </div>
    );
  }
}
