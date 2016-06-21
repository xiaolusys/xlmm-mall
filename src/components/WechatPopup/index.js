import React, { Component } from 'react';
import classnames from 'classnames';
import * as utils from 'utils';
import _ from 'underscore';
import { Popup } from 'components/Popup';

import './index.scss';

export class WechatPopup extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    active: React.PropTypes.bool,
    onCloseBtnClick: React.PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'wechat-share-popup',
    onCloseBtnClick: _.noop,
  };

  render() {
    const { prefixCls, active, onCloseBtnClick } = this.props;
    return (
      <Popup className={prefixCls} active={active}>
        <img src="http://7xogkj.com1.z0.glb.clouddn.com/mall/wechat-share.png" />
        <div className="text-center margin-top-lg">
          <i className="icon-close-o icon-2x icon-white" onClick={onCloseBtnClick}></i>
        </div>
      </Popup>
    );
  }
}
