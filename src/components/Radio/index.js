import React, { Component, PropTypes } from 'react';
import RcCheckbox from 'rc-checkbox';

import './index.scss';

export class Radio extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'radio-button',
    type: 'radio',
  }

  render() {
    return <RcCheckbox {...this.props} ref="checkbox"/>;
  }
}
