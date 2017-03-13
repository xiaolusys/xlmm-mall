import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { WechatPopup } from 'components/WechatPopup';
import _ from 'underscore';
import * as utils from 'utils';
import * as shareRedpacketAction from 'actions/order/shareRedpacket';
import * as wechatSignAction from 'actions/wechat/sign';

import './index.scss';

const actionCreators = _.extend(shareRedpacketAction, wechatSignAction);

@connect(
  state => ({
    shareRedpacket: state.shareRedpacket,
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Success extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    shareRedpacket: React.PropTypes.object,
    wechatSign: React.PropTypes.object,
    fetchShareRedpacket: React.PropTypes.func,
    fetchWechatSign: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'order-success',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    sharePopupActive: false,
  }

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchWechatSign();
    // this.props.fetchShareRedpacket(params.tid);
  }

  componentWillReceiveProps(nextProps) {
    const { wechatSign, shareRedpacket } = nextProps;
    utils.wechat.config(wechatSign);
    if (shareRedpacket.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (!shareRedpacket.isLoading && shareRedpacket.success) {
      const shareInfo = {
        success: shareRedpacket.success,
        data: {
          title: shareRedpacket.data.title,
          desc: shareRedpacket.data.description,
          share_link: shareRedpacket.data.share_link,
          share_img: shareRedpacket.data.post_img,
        },
      };
      utils.wechat.configShareContent(shareInfo);
    }
  }

  onViewOrderBtnClick = (e) => {
    const { params } = this.props;
    this.context.router.push(`/od.html?tid=${params.tid}&id=${params.tradeId}`);
  }

  onShareRedpacketBtnClick = (e) => {
    if (utils.detector.isWechat()) {
      this.setState({ sharePopupActive: true });
      return;
    }
  }

  onCloseBtnClick = (e) => {
    this.setState({ sharePopupActive: false });
  }

  render() {
    const { prefixCls, shareRedpacket } = this.props;
    return (
      <div className={`${prefixCls}`}>
        <Header title="支付成功" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content content-white-bg">
          <div className="text-center padding-top-lg padding-bottom-lg">
            <i className="icon-order-succeed icon-6x icon-yellow"></i>
            <p className="font-xlg font-weight-600">支付成功!</p>
            <button className="button button-stable" type="button" onClick={this.onViewOrderBtnClick}>查看订单</button>
          </div>
          <If condition={false}>
          <div className="redpacket-container text-center">
            <div className="redpacket">
              <img src="//og224uhh3.qnssl.com/mall/redpacket-bg.jpg" />
              <div>
                <p className="font-white redpacket-count"><span>恭喜你获得</span><span className="font-30">{shareRedpacket.data && shareRedpacket.data.share_times_limit}</span><span>个红包</span></p>
                <p className="font-yellow">分享红包给好友可抵扣在线支付金额</p>
                <button className="button button-energized font-md col-xs-10 col-xs-offset-1" type="button" onClick={this.onShareRedpacketBtnClick}>分享领取红包</button>
              </div>
            </div>
          </div>
          </If>
        </div>
        <WechatPopup active={this.state.sharePopupActive} onCloseBtnClick={this.onCloseBtnClick}/>
      </div>
    );
  }

}
