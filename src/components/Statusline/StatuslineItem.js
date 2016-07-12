import React, { Component } from 'react';
import classNames from 'classnames';

export default class StatuslineItem extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    headColor: React.PropTypes.string,
    tailColor: React.PropTypes.string,
    children: React.PropTypes.any,
    className: React.PropTypes.string,
  }
  static defaultProps = {
    prefixCls: 'statusline',
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
      <div {...restProps} className={`${itemClassName} padding-bottom-xs`}>
        <div className={`${prefixCls}-item-tail ${prefixCls}-item-tail-${tailColor}`} />
        <div className={`${prefixCls}-item-head ${prefixCls}-item-head-${headColor}`} />
        <div className={`${prefixCls}-item-content`}>{children}</div>
      </div>
    );
  }
}
