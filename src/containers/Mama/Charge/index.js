import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';
import { Popup } from 'components/Popup';
import { If } from 'jsx-control-statements';
import * as utils from 'utils';
import * as verifyCodeAction from 'actions/user/verifyCode';
import * as mamaInfoAction from 'actions/mama/mamaInfo';
import * as mamaOrderAction from 'actions/mama/mamaOrder';
import * as mamaChargeAction from 'actions/mama/mamaCharge';
import * as inviteSharingAction from 'actions/mama/inviteSharing';
import * as wechatSignAction from 'actions/wechat/sign';

import './index.scss';

const pageInfos = {
  'mct.html': {
    banner: 'http://7xogkj.com1.z0.glb.clouddn.com/mall/opening-shop-banner.jpg',
    id: 2,
    shareId: 27,
  },
  'mcf.html': {
    banner: 'http://7xogkj.com1.z0.glb.clouddn.com/lALOXWJK2s0NyM0F3A_1500_3528.png',
    id: 0,
    shareId: 26,
  },
};

const actionCreators = _.extend(verifyCodeAction, mamaInfoAction, mamaOrderAction, mamaChargeAction, inviteSharingAction, wechatSignAction);

@connect(
  state => ({
    verifyCode: state.verifyCode,
    mamaInfo: state.mamaInfo,
    mamaOrder: state.mamaOrder,
    mamaCharge: state.mamaCharge,
    inviteSharing: state.inviteSharing,
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Charge extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    fetchVerifyCode: React.PropTypes.func,
    verify: React.PropTypes.func,
    resetVerifyState: React.PropTypes.func,
    resetFetchState: React.PropTypes.func,
    fetchMamaInfo: React.PropTypes.func,
    saveMamaInfo: React.PropTypes.func,
    fetchMamaOrder: React.PropTypes.func,
    fetchMamaCharge: React.PropTypes.func,
    fetchInviteSharing: React.PropTypes.func,
    fetchWechatSign: React.PropTypes.func,
    mamaInfo: React.PropTypes.any,
    mamaOrder: React.PropTypes.any,
    mamaCharge: React.PropTypes.any,
    verifyCode: React.PropTypes.any,
    inviteSharing: React.PropTypes.object,
    wechatSign: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    phone: '',
    code: '',
    payTypePopupActive: false,
  }

  componentWillMount() {
    const { location } = this.props;
    const pageInfo = pageInfos[location.pathname];
    console.log(pageInfo);
    if (pageInfo) {
      this.setState({ pageInfo: pageInfo });
    }
    this.props.fetchMamaInfo();
    this.props.fetchMamaOrder();
    this.props.fetchInviteSharing(pageInfo.shareId);
    this.props.fetchWechatSign();
  }

  componentWillReceiveProps(nextProps) {
    const { fetch, verify } = nextProps.verifyCode;
    const { mamaCharge, wechatSign, inviteSharing } = nextProps;
    utils.wechat.config(wechatSign);

    if (!inviteSharing.isLoading && inviteSharing.success) {
      const shareInfo = {
        success: inviteSharing.success,
        data: {
          title: inviteSharing.data.title,
          desc: inviteSharing.data.active_dec,
          share_link: inviteSharing.data.share_link,
          share_img: inviteSharing.data.share_icon,
        },
      };
      utils.wechat.configShareContent(shareInfo);
    }

    if ((fetch.success || fetch.error) && !fetch.isLoading && !this.state.verifyCode) {
      Toast.show(fetch.data.msg);
    }
    if (verify.error && !verify.isLoading && !this.state.password) {
      Toast.show(verify.data.msg);
    }
    if (mamaCharge.success && !mamaCharge.isLoading && !_.isEmpty(mamaCharge.data)) {
      this.pay(mamaCharge.data);
    }
  }

  componentWillUnmount() {
    this.props.resetFetchState();
    this.props.resetVerifyState();
    this.props.fetchInviteSharing(27);
  }

  onPhoneChange = (val) => {
    this.setState({ phone: val });
  }

  onVerifyCodeChange = (e) => {
    this.setState({ code: e.target.value });
  }

  onVerifyCodeBlur = () => {
    this.props.resetFetchState();
    if (_.isEmpty(this.state.code)) {
      return;
    }
    this.props.verify(this.state.phone, this.state.code, 'bind');
  }

  onGetVerifyCodeBtnClick = () => {
    this.props.fetchVerifyCode(this.state.phone, 'bind');
  }

  onChargeClick = (e) => {
    const { paytype } = e.currentTarget.dataset;
    this.setState({ payChannel: paytype });
    const mamaOrder = this.props.mamaOrder.data || {};
    const { id } = this.state.pageInfo;
    this.props.fetchMamaCharge({
      product_id: mamaOrder.product.id,
      sku_id: mamaOrder.product.normal_skus[id].id,
      payment: mamaOrder.payinfos[id].total_payment,
      channel: paytype,
      num: 1,
      post_fee: 0,
      discount_fee: 0,
      uuid: mamaOrder.uuid,
      total_fee: mamaOrder.payinfos[id].total_payment,
      success_url: '/mall/mama/open/succeed',
      cancel_url: '/mall/mama/open/failed',
    });
  }

  togglePayTypePopupActive = () => {
    const { mama_id } = this.props.location.query;
    const { verify } = this.props.verifyCode;
    const { mamaInfo } = this.props;
    if (!verify.success) {
      Toast.show('请先验证手机号');
      return;
    }
    if (mamaInfo.success && !_.isEmpty(mamaInfo.data) && !mamaInfo.data[0].can_trial) {
      Toast.show('您已经是小鹿妈妈');
      return;
    }
    this.setState({ payTypePopupActive: !this.state.payTypePopupActive });
    this.props.saveMamaInfo({
      mama_mobile: this.state.phone,
      mama_id: mama_id,
    });
  }

  payInfo = () => {
    const { id } = this.state.pageInfo;
    let payInfo = { total_payment: 0 };
    if (!_.isEmpty(this.props.mamaOrder.data.payinfos)) {
      payInfo = this.props.mamaOrder.data.payinfos[id];
      payInfo.channels = [];
      if (payInfo.weixin_payable) {
        payInfo.channels.push({
          id: 'wx_pub',
          icon: 'icon-wechat-pay icon-wechat-green',
          name: '微信支付',
        });
      }
      if (payInfo.alipay_payable) {
        payInfo.channels.push({
          id: 'alipay_wap',
          icon: 'icon-alipay-square icon-alipay-blue',
          name: '支付宝',
        });
      }
    }
    return payInfo;
  }

  pay = (charge) => {
    this.setState({ payTypePopupActive: !this.state.payTypePopupActive });
    window.pingpp.createPayment(charge, (result, error) => {
      if (result === 'success') {
        window.location.replace('/mall/mama/open/succeed');
        return;
      }
      window.location.replace('/mall/mama/open/failed');
    });
  }

  render() {
    const { banner } = this.state.pageInfo;
    const payInfo = this.payInfo();
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding content-white-bg opening-shop">
        <Image style={{ width: '100%' }} src={banner} />
        <Input type="number" placeholder="请输入手机号" onChange={this.onPhoneChange}/>
        <div className="row no-margin password-box bottom-border margin-bottom-xs">
          <input className="col-xs-8" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} onBlur= {this.onVerifyCodeBlur} />
          <button className="col-xs-4 button button-sm button-light" type="button" onClick={this.onGetVerifyCodeBtnClick}>获取验证码</button>
        </div>
        <div className="row no-margin text-center margin-bottom-xs">
          <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.togglePayTypePopupActive}>马上一元开店</button>
        </div>
        <div className="row no-margin text-center margin-bottom-xs">
          <Checkbox className="margin-bottom-xs" checked>同意一元体验15天</Checkbox>
          <Link to="/activity/shop/agreement">小鹿妈妈服务条款！</Link>
        </div>
        <Popup active={this.state.payTypePopupActive} className="pay-type-popup">
          <div className="row no-margin bottom-border">
            <i className="col-xs-1 no-padding icon-close font-orange" onClick={this.togglePayTypePopupActive}></i>
            <p className="col-xs-11 no-padding text-center">
              <span className="font-xs">应付款金额</span>
              <span className="font-lg font-orange">{`￥${payInfo.total_payment && payInfo.total_payment.toFixed(2)}`}</span>
            </p>
          </div>
          {payInfo.channels && payInfo.channels.map((channel) =>
            (
              <div className="bottom-border pay-type-item" key={channel.id} data-paytype={channel.id} onClick={this.onChargeClick}>
                <i className={`${channel.icon} icon-2x margin-right-xxs`}></i>
                <span className="inline-block margin-top-xxs">{channel.name}</span>
              </div>
            )
          )}
        </Popup>
      </div>
    );
  }
}
