import React, { Component, PropTypes } from 'react';
import RcCheckbox from 'rc-checkbox';
import classnames from 'classnames';

import './index.scss';

export class Checkbox extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    style: React.PropTypes.string,
    children: React.PropTypes.any,
    className: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'checkbox',
  }

  render() {
    const { prefixCls, style, children, className, ...restProps } = this.props;
    const checkboxCls = classnames({
      [className]: !!className,
      [`${prefixCls}-wrapper`]: true,
    });
    return (
      <label className={checkboxCls} style={style}>
        <RcCheckbox {...restProps} prefixCls={prefixCls} children={null} />
        {children ? <span>{children}</span> : null}
      </label>
    );
  }

}
