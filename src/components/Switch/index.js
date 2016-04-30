import React, { Component, PropTypes } from 'react';
import RcSwitch from 'rc-switch';
import classnames from 'classnames';

import './index.scss';

export class Switch extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    size: React.PropTypes.string,
    children: React.PropTypes.any,
    className: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'switch',
  }

  render() {
    const { prefixCls, size, className } = this.props;
    const cls = classnames({
      [className]: !!className,
      [`${prefixCls}-small`]: size === 'small',
    });
    return <RcSwitch className={cls} {...this.props} />;
  }
}
