import React, { Component } from 'react';
import classnames from 'classnames';
import * as utils from 'utils';
import _ from 'underscore';
import { Popup } from 'components/Popup';

import './index.scss';

export class DownloadAppPopup extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    active: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onDownload: React.PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'download-app-popup',
    onCloseBtnClick: _.noop,
  };

  render() {
    const { prefixCls, active, onClose, onDownload } = this.props;
    return (
      <Popup className={prefixCls} active={active} maxHeight="100%">
        <div className={`${prefixCls}-container`}>
          <div className="close-btn text-center">
            <i className="icon-close-o icon-2x icon-white" onClick={onClose}></i>
          </div>
          <img src="http://7xogkj.com1.z0.glb.clouddn.com/mall/download-popup.png" />
          <button className="download-btn text-center" type="button" onClick={onDownload} >立即下载</button>
        </div>
      </Popup>
    );
  }
}
