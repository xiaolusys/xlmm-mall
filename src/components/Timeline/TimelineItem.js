import React, { Component } from 'react';
import classNames from 'classnames';

export default class TimelineItem extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    headColor: React.PropTypes.string,
    tailColor: React.PropTypes.string,
    children: React.PropTypes.any,
    className: React.PropTypes.string,
  }
  static defaultProps = {
    prefixCls: 'timeline',
    tailColor: 'grey',
    headColor: 'grey',
    last: false,
    pending: false,
  }

  render() {
    const { prefixCls, headColor, tailColor, children, className, ...restProps } = this.props;
    const itemClassName = classNames({
      [`${prefixCls}-item`]: true,
      [className]: className,
    });
    return (
      <li {...restProps} className={itemClassName}>
        <div className={`${prefixCls}-item-tail ${prefixCls}-item-tail-${tailColor}`} />
        <div className={`${prefixCls}-item-head ${prefixCls}-item-head-${headColor}`} />
        <div className={`${prefixCls}-item-content`}>{children}</div>
      </li>
    );
  }
}
