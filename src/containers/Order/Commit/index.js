import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { BottomBar } from 'components/BottomBar';
import { Radio } from 'components/Radio';
import { Checkbox } from 'components/Checkbox';
import { Popup } from 'components/Popup';
import { Toast } from 'components/Toast';
import classnames from 'classnames';
import * as constants from 'constants';
import * as utils from 'utils';
import pingpp from 'vendor/pingpp';
import _ from 'underscore';
import * as addressAction from 'actions/user/address';
import * as couponAction from 'actions/user/coupon';
import * as payInfoAction from 'actions/order/payInfo';
import * as commitOrderAction from 'actions/order/commit';

import './index.scss';

const actionCreators = _.extend(addressAction, couponAction, payInfoAction, commitOrderAction);
const payTypeIcons = {
  wx_pub: 'icon-wechat-pay icon-wechat-green',
  alipay_wap: 'icon-alipay-square icon-alipay-blue',
};
const paymentResults = {
  success: '/pages/zhifucg.html',
  error: '/pages/daizhifu-dd.html',
};

@connect(
  state => ({
    address: state.address,
    coupon: state.coupon,
    payInfo: state.payInfo,
    order: state.commitOrder,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Commit extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    address: React.PropTypes.object,
    coupon: React.PropTypes.object,
    order: React.PropTypes.object,
    payInfo: React.PropTypes.object,
    fetchPayInfo: React.PropTypes.func,
    fetchCouponById: React.PropTypes.func,
    resetCoupon: React.PropTypes.func,
    fetchAddress: React.PropTypes.func,
    commitOrder: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'order-confirm',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    walletChecked: false,
    walletBalance: 0,
    logisticsCompany: '',
    payTypePopupActive: false,
  }

  componentWillMount() {
    document.location.href = utils.url.getBaseUrl() + this.props.location.pathname;
    const { addressId, couponId } = this.props.location.query;
    this.props.fetchAddress(addressId ? addressId : 'get_default_address');
    this.props.fetchPayInfo(this.props.params.cartIds);
    if (couponId) {
      this.props.fetchCouponById(couponId);
    }
  }

  componentDidMount() {
    this.props.resetCoupon();
  }

  componentWillReceiveProps(nextProps) {
    const { order, payInfo, address } = nextProps;
    const { router } = this.context;
    if (order.success && order.data.charge && order.data.charge.channel !== 'budget') {
      this.pay(order.data.charge);
    }
    if (order.success && order.data.charge && order.data.charge.channel === 'budget') {
      if (order.data.charge.success) {
        window.location.replace(paymentResults.success);
        // router.replace(paymentResults.success);
      } else {
        window.location.replace(paymentResults.error);
        // router.replace(paymentResults.error);
      }
    }
    if (payInfo.isLoading || order.isLoading || address.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (payInfo.error) {
      this.context.router.goBack();
    }
  }

  componentWillUnmount() {
    this.props.resetCoupon();
  }

  onCommitOrderClick = (e) => {
    const { address, payInfo } = this.props;
    const { walletChecked, walletBalance, walletPayType, logisticsCompany } = this.state;
    if (walletChecked && walletBalance >= payInfo.data.total_fee) {
      this.props.commitOrder({
        uuid: payInfo.data.uuid,
        cart_ids: payInfo.data.cart_ids,
        payment: this.getpPaymentPrice(payInfo.data.total_payment),
        post_fee: payInfo.data.post_fee,
        discount_fee: this.getDiscountValue(),
        total_fee: payInfo.data.total_fee,
        addr_id: address.data.id,
        channel: this.getPayType(),
        logistics_company_id: logisticsCompany,
      });

    } else if (walletBalance < payInfo.data.total_fee) {
      this.togglePayTypePopupActive();
    }
    e.preventDefault();
  }

  onPayTypeClick = (e) => {
    const { address, payInfo } = this.props;
    const { walletChecked, walletBalance, walletPayType, logisticsCompany } = this.state;
    const { paytype } = e.currentTarget.dataset;
    this.props.commitOrder({
      uuid: payInfo.data.uuid,
      cart_ids: payInfo.data.cart_ids,
      payment: this.getpPaymentPrice(payInfo.data.total_payment),
      post_fee: payInfo.data.post_fee,
      discount_fee: payInfo.data.discount_fee,
      total_fee: payInfo.data.total_fee,
      addr_id: address.data.id,
      channel: this.getPayType(paytype),
      logistics_company_id: logisticsCompany,
    });
    e.preventDefault();
  }

  onLinkClick = (e) => {
    this.context.router.push(e.currentTarget.dataset.to);
    e.preventDefault();
  }

  onWalletChange = (e) => {
    this.setState({
      walletChecked: !this.state.walletChecked,
      walletBalance: Number(e.target.walletBalance),
      walletPayType: e.target.payType,
    });
    e.preventDefault();
  }

  onLogisticsCompanyChange = (e) => {
    this.setState({ logisticsCompany: e.target.value });
    e.preventDefault();
  }

  getPayExtras = () => {
    const self = this;
    const { coupon, payInfo } = this.props;
    const { walletChecked, walletBalance, walletPayType } = this.state;
    const payExtras = [];
    _.each(payInfo.data.pay_extras, (extra) => {
      if (extra.pid === 3 && walletChecked && walletBalance > 0 && self.getDisplayPrice() > 0) {
        payExtras.push('pid:' + extra.pid + ':value:' + extra.value);
      }
      if (extra.pid === 2 && self.getDiscountValue() > 0) {
        payExtras.push('pid:' + extra.pid + ':value:' + self.getDiscountValue());
        payExtras.push('conponid:' + coupon.data.id);
      }
    });
    return payExtras.join(','); // pid:1:value:2,pid:2:value:3,conponid:2
  }

  getPayType = (payType) => {
    const { payInfo } = this.props;
    const { walletChecked, walletBalance, walletPayType } = this.state;
    if (walletChecked && payInfo.data.total_fee <= walletBalance) {
      return walletPayType;
    }
    return payType;
  }

  getpPaymentPrice = (totalPrice) => {
    const { coupon, payInfo } = this.props;
    let value = totalPrice || 0;
    if (value > 0 && coupon.success && coupon.data.status === 0 && payInfo.data.total_fee >= coupon.data.use_fee) {
      value = value - coupon.data.coupon_value;
    }
    return value.toFixed(2);
  }

  getDisplayPrice = (totalPrice) => {
    const { coupon, payInfo } = this.props;
    const { walletChecked, walletBalance } = this.state;
    let displayPrice = payInfo.data.total_fee || 0;
    if (totalPrice && walletChecked && walletBalance >= payInfo.data.total_fee) {
      displayPrice = 0;
    } else if (totalPrice && walletChecked && walletBalance < payInfo.data.total_fee) {
      displayPrice = displayPrice - walletBalance;
    }
    if (displayPrice > 0 && coupon.success && coupon.data.status === 0 && payInfo.data.total_fee >= coupon.data.use_fee) {
      displayPrice = displayPrice - coupon.data.coupon_value;
    }
    return displayPrice.toFixed(2);
  }

  getTotalPrice = () => {
    const { coupon, payInfo } = this.props;
    let totalPrice = payInfo.data.total_fee || 0;
    if (totalPrice > 0 && coupon.success && coupon.data.status === 0 && payInfo.data.total_fee >= coupon.data.use_fee) {
      totalPrice = totalPrice - coupon.data.coupon_value;
    }
    return totalPrice;
  }

  getDiscountValue() {
    const { coupon, payInfo } = this.props;
    let discount = 0;
    if (coupon.success && coupon.data.status === 0 && payInfo.data.total_fee >= coupon.data.use_fee) {
      discount = coupon.data.coupon_value;
    } else if (coupon.success && (coupon.data.status !== 0 || payInfo.data.total_fee < coupon.data.use_fee)) {
      Toast.show('优惠券不可用！');
    }
    return discount.toFixed(2);
  }

  togglePayTypePopupActive = () => {
    this.setState({ payTypePopupActive: !this.state.payTypePopupActive });
  }

  pay = (charge) => {
    this.togglePayTypePopupActive();
    window.pingpp.createPayment(charge, (result, error) => {
      if (result === 'success') {
        window.location.replace(paymentResults.success);
        // this.context.router.replace(paymentResults.success);
        return;
      }
      window.location.replace(paymentResults.error);
      // this.context.router.replace(paymentResults.error);
    });
  }

  renderProducts(products = []) {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-product-list margin-top-xs`}>
        {products.map((product, index) => {
          return (
            <div key={product.id} className="row no-margin bottom-border">
              <If condition={product.status === 1}>
                <div className="col-xs-3 no-padding">
                  <img src={product.pic_path + constants.image.square} />
                </div>
                <div className="col-xs-9 no-padding">
                  <p className="row no-margin">
                    <span>{product.title}</span>
                    <span className="pull-right">{'￥' + product.price}</span>
                  </p>
                  <p className="row no-margin font-grey-light">
                    <span>{'尺码：' + product.sku_name}</span>
                    <span className="pull-right">{'x' + product.num}</span>
                  </p>
                </div>
              </If>
              <If condition={product.status !== 1}>
                <div className="col-xs-3 no-padding">
                  <img src={product.pic_path + constants.image.square} />
                </div>
                <div className="col-xs-9 no-padding">
                  <p className="row no-margin">
                    <span>{product.title}</span>
                    <span className="pull-right">{'￥' + product.price}</span>
                  </p>
                  <p className="row no-margin font-grey-light">
                    <span>{'尺码：' + product.sku_name}</span>
                    <span className="pull-right">{'x' + product.num}</span>
                  </p>
                </div>
              </If>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { prefixCls, payInfo, order } = this.props;
    const products = payInfo.data.cart_list || [];
    const logisticsCompanies = payInfo.data.logistics_companys || [];
    const payExtras = payInfo.data.pay_extras || [];
    const address = this.props.address.data || {};
    const channels = this.props.payInfo.data.channels || [];
    const { pathname, query } = this.props.location;
    const addressLink = '/user/address?next=' + encodeURIComponent(pathname + (query.couponId ? '?couponId=' + query.couponId : ''));
    const couponLink = '/user/coupons?next=' + encodeURIComponent(pathname + (query.addressId ? '?addressId=' + query.addressId : ''));
    return (
      <div className={`${prefixCls}`}>
        <Header title="确认订单" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          <div className={`row no-margin bottom-border ${prefixCls}-address`} data-to={addressLink} onClick={this.onLinkClick}>
            <If condition={!_.isEmpty(address)}>
              <i className="col-xs-1 no-padding margin-top-xxs icon-location icon-2x icon-yellow-light"></i>
              <div className="col-xs-10">
                <p><span className="margin-right-sm">{address.receiver_name}</span><span>{address.receiver_mobile}</span></p>
                <p className="font-grey-light">{address.receiver_state + address.receiver_city + address.receiver_district + address.receiver_address}</p>
              </div>
              <i className="col-xs-1 no-padding margin-top-28 text-right icon-angle-right icon-grey"></i>
            </If>
            <If condition={_.isEmpty(address)}>
              <i className="col-xs-1 no-padding icon-location icon-2x icon-yellow-light"></i>
              <div className="col-xs-10 margin-top-xxs">填写收货地址</div>
              <i className="col-xs-1 no-padding margin-top-xxs text-right icon-angle-right icon-grey"></i>
            </If>
          </div>
          {this.renderProducts(products)}
          <div className={`row no-margin bottom-border margin-top-xs ${prefixCls}-row`}>
            <p className="col-xs-5 no-padding">物流配送</p>
            <div className="col-xs-7 no-padding">
              <div className="col-xs-11 no-padding text-right logistics-companies">
                <select className="inline-block" value={this.state.logisticsCompany} onChange={this.onLogisticsCompanyChange}>
                {logisticsCompanies.map((item) => {
                  return (
                    <option className="text-right" key={item.id} value={item.id}>{item.name}</option>
                  );
                })}
                </select>
              </div>
              <i className="col-xs-1 no-padding margin-top-28 text-right icon-angle-right icon-grey"></i>
            </div>
          </div>
          {payExtras.map((item) => {
            switch (item.pid) {
              case 2:
                if (item.pid === 2 && !item.use_coupon_allowed) {
                  return null;
                }
                return (
                  <div className={`row no-margin bottom-border margin-top-xs ${prefixCls}-row`} key={item.pid} data-to={couponLink} onClick={this.onLinkClick}>
                    <p className="col-xs-5 no-padding">可用优惠券</p>
                    <p className="col-xs-7 no-padding">
                      <span className="col-xs-11 no-padding text-right">{'￥-' + this.getDiscountValue()}</span>
                      <i className="col-xs-1 no-padding margin-top-28 text-right icon-angle-right icon-grey"></i>
                    </p>
                  </div>
                );
              case 3:
                if (item.pid === 3 && !item.use_budget_allowed) {
                  return null;
                }
                return (
                  <div className={`row no-margin bottom-border ${prefixCls}-row`} key={item.pid}>
                    <p className="col-xs-5 no-padding">小鹿钱包</p>
                    <p className="col-xs-7 no-padding">
                      <span className="col-xs-10 no-padding text-right">{item.value}</span>
                      <Checkbox className="col-xs-2" checked={this.state.walletChecked} walletBalance={item.value} payType={item.channel} onChange={this.onWalletChange}/>
                    </p>
                  </div>
                );
              default:
                break;
            }
          })}
          <div className={`row no-margin bottom-border ${prefixCls}-row`}>
            <p className="col-xs-5 no-padding">运费</p>
            <p className="col-xs-7 no-padding text-right">{payInfo.data.post_fee}</p>
          </div>
          <div className={`row no-margin text-right ${prefixCls}-row transparent`}>
            <p className="col-xs-12 no-padding"><span>合计：￥</span><span>{this.getTotalPrice()}</span></p>
          </div>
        </div>
        <BottomBar size="large">
          <p>
            <span className="font-xs">应付款金额</span>
            <span className="font-lg font-orange">{'￥' + this.getDisplayPrice(payInfo.data.total_payment)}</span>
          </p>
          <button className="button button-energized col-xs-12" type="button" onClick={this.onCommitOrderClick}>购买</button>
        </BottomBar>
        <Popup active={this.state.payTypePopupActive} className="pay-type-popup" height="auto">
          <div className={`row no-margin bottom-border ${prefixCls}-row`}>
            <i className="col-xs-1 no-padding icon-angle-left" onClick={this.togglePayTypePopupActive}></i>
            <p className="col-xs-11 no-padding text-center">
              <span className="font-xs">应付款金额</span>
              <span className="font-lg font-orange">{'￥' + this.getDisplayPrice(payInfo.data.total_payment)}</span>
            </p>
          </div>
          {channels.map((channel) => {
            if (!channel.payable) {
              return null;
            }
            return (
              <div className="bottom-border pay-type-item" key={channel.id} data-paytype={channel.id} onClick={this.onPayTypeClick}>
                <i className={`${payTypeIcons[channel.id]} icon-2x margin-right-xxs`}></i>
                <span className="inline-block margin-top-xxs">{channel.name}</span>
              </div>
            );
          })}
        </Popup>
      </div>
    );
  }
}
