import React, { Component } from 'react';
import classnames from 'classnames';

export default class Timeline extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    className: React.PropTypes.string,
  }

  static defaultProps = {
    prefixCls: 'timeline',
  }

  render() {
    const { prefixCls, children, className, ...restProps } = this.props;
    const classString = classnames({
      [prefixCls]: true,
      [className]: className,
    });
    return (
      <ul {...restProps} className={classString}>
        {
          React.Children.map(children, (ele, idx) =>
            React.cloneElement(ele, {
              last: idx === children.length - 1,
            })
          )
        }
      </ul>
    );
  }
}
