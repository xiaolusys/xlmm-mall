import React, { Component } from 'react';
import classnames from 'classnames';
import * as utils from 'utils';
import _ from 'underscore';
import constants from 'constants';
import { If } from 'jsx-control-statements';

import './index.scss';

export class DownloadAppBanner extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    onClose: React.PropTypes.func,
    onDownload: React.PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'download-app-banner',
    onCloseBtnClick: _.noop,
  };

  state = {
    visible: window.sessionStorage.downloadAppBannerVisible || 1,
  }

  onCloseClick = (e) => {
    window.sessionStorage.setItem('downloadAppBannerVisible', 0);
    this.setState({ visible: 0 });
  }

  onDownlodClick = (e) => {
    const mmLinkId = utils.cookie.getCookie('mm_linkid') || '';
    const uFrom = utils.cookie.getCookie('ufrom') || '';
    window.location.href = `${constants.downloadAppUri}?mm_linkid=${mmLinkId}&ufrom=${uFrom}`;
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <If condition={this.state.visible === 1}>
        <div className={`${prefixCls} clearfix`}>
          <div className="pull-left" style={{ lineHeight: '48px' }}>
            <i className="icon-close" onClick={this.onCloseClick}></i>
            <span style={{ marginLeft: '8px' }}>用App首次支付</span>
            <span style={{ fontSize: '18px' }}>立减12元</span>
          </div>
          <div className="pull-right">
            <button className="button button-energized button-sm" style={{ height: '32px', margin: '8px 0px' }} type="button" onClick={this.onDownlodClick}>下载App</button>
          </div>
        </div>
      </If>
    );
  }
}
