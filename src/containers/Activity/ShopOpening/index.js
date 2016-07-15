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
import * as verifyCodeAction from 'actions/user/verifyCode';
import * as mamaInfoAction from 'actions/activity/mamaInfo';
import * as mamaOrderAction from 'actions/activity/mamaOrder';
import * as mamaChargeAction from 'actions/activity/mamaCharge';

import './index.scss';

const banner = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/opening-shop-banner.jpg';
const actionCreators = _.extend(verifyCodeAction, mamaInfoAction, mamaOrderAction, mamaChargeAction);

@connect(
  state => ({
    verifyCode: state.verifyCode,
    mamaInfo: state.mamaInfo,
    mamaOrder: state.mamaOrder,
    mamaCharge: state.mamaCharge,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class OpeningShop extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    fetchVerifyCode: React.PropTypes.func,
    verify: React.PropTypes.func,
    resetVerifyState: React.PropTypes.func,
    resetFetchState: React.PropTypes.func,
    fetchMamaInfo: React.PropTypes.func,
    fetchMamaOrder: React.PropTypes.func,
    fetchMamaCharge: React.PropTypes.func,
    mamaInfo: React.PropTypes.any,
    mamaOrder: React.PropTypes.any,
    mamaCharge: React.PropTypes.any,
    verifyCode: React.PropTypes.any,
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
    this.props.fetchMamaInfo();
    this.props.fetchMamaOrder();
  }

  componentWillReceiveProps(nextProps) {
    const { fetch, verify } = nextProps.verifyCode;
    const { mamaCharge } = nextProps;
    if ((fetch.success || fetch.error) && !fetch.isLoading && !this.state.verifyCode) {
      Toast.show(fetch.data.msg);
    }
    if ((verify.success || verify.error) && !verify.isLoading && !this.state.password) {
      Toast.show(verify.data.msg);
    }
    if (mamaCharge.success && !mamaCharge.isLoading && !_.isEmpty(mamaCharge.data)) {
      this.pay(mamaCharge.data);
    }
  }

  onPhoneChange = (val) => {
    this.setState({ phone: val });
  }

  onVerifyCodeChange = (e) => {
    this.setState({ code: e.target.value });
  }

  onVerifyCodeBlur = () => {
    this.props.resetFetchState();
    this.props.verify(this.state.phone, this.state.code, 'bind');
  }

  onGetVerifyCodeBtnClick = () => {
    this.props.fetchVerifyCode(this.state.phone, 'bind');
  }

  onChargeClick = (e) => {
    const { paytype } = e.currentTarget.dataset;
    this.setState({ payChannel: paytype });
    const mamaOrder = this.props.mamaOrder.data || {};
    console.log(mamaOrder);
    this.props.fetchMamaCharge({
      product_id: mamaOrder.product.id,
      sku_id: mamaOrder.product.normal_skus[2].id,
      payment: mamaOrder.payinfos[2].total_payment,
      channel: paytype,
      num: 1,
      post_fee: 0,
      discount_fee: 0,
      uuid: mamaOrder.uuid,
      total_fee: mamaOrder.payinfos[2].total_payment,
      success_url: '/mall/activity/shop/open/succeed',
      cancel_url: '/mall/activity/shop/open/failed',
    });
  }

  togglePayTypePopupActive = () => {
    const { verify } = this.props.verifyCode;
    const { mamaInfo } = this.props;
    if (!verify.success) {
      Toast.show('请先验证手机号');
      return;
    }
    if (!_.isEmpty(mamaInfo.data)) {
      Toast.show('您已经是小鹿妈妈');
      return;
    }
    this.setState({ payTypePopupActive: !this.state.payTypePopupActive });
  }

  payInfo = () => {
    let payInfo = { total_payment: 0 };
    if (!_.isEmpty(this.props.mamaOrder.data.payinfos)) {
      payInfo = this.props.mamaOrder.data.payinfos[2];
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
    this.togglePayTypePopupActive();
    window.pingpp.createPayment(charge, (result, error) => {
      if (result === 'success') {
        // window.location.replace('/mall/activity/shop/open/succeed');
        return;
      }
      // window.location.replace('/mall/activity/shop/open/failed');
    });
  }

  render() {
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
