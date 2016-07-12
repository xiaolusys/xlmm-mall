import React, { Component } from 'react';
import classnames from 'classnames';

export default class StatusLine extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    className: React.PropTypes.string,
    width: React.PropTypes.string,
  }

  static defaultProps = {
    prefixCls: 'statusline',
  }

  render() {
    const { prefixCls, children, className, width, ...restProps } = this.props;
    const classString = classnames({
      [prefixCls]: true,
      [className]: className,
    });
    return (
      <div {...restProps} className={`${classString}`} style={{ width: width }}>
        {
          React.Children.map(children, (ele, idx) =>
            React.cloneElement(ele, {
              last: idx === children.length - 1,
            })
          )
        }
      </div>
    );
  }
}
