import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { BottomBar } from 'components/BottomBar';
import { Radio } from 'components/Radio';
import classnames from 'classnames';
import * as constants from 'constants';
import * as utils from 'utils';
import _ from 'underscore';
import * as addressAction from 'actions/user/address';
import * as couponsAction from 'actions/user/coupons';
import * as payInfoAction from 'actions/order/payInfo';
import * as commitOrderAction from 'actions/order/commit';

import './index.scss';

const actionCreators = _.extend(addressAction, couponsAction, payInfoAction, commitOrderAction);

const payType = {
  alipay: 0,
  wechat: 1,
};

@connect(
  state => ({
    address: state.address,
    coupons: state.coupons,
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
    coupons: React.PropTypes.object,
    payInfo: React.PropTypes.object,
    fetchPayInfo: React.PropTypes.func,
    fetchCoupons: React.PropTypes.func,
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
    defaultPayType: payType.alipay,
  }

  componentWillMount() {
    const { addressId } = this.props.location.query;
    this.props.fetchAddress(addressId ? addressId : 'get_default_address');
    this.props.fetchPayInfo(this.props.params.cartIds);
    // this.props.fetchCoupons(constants.couponStatus.available);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  onCommitOrderClick = (e) => {
    // const { address, payInfo, }
    // this.props.commitOrder({
    //   uuid: ,
    //   cart_ids:  ,
    //   payment: ,
    //   post_fee: ,
    //   discount_fee: ,
    //   total_fee: ,
    //   addr_id: address.id,
    //   channel: ,
    //   coupon_id: ,
    // })
  }

  onPayTypeClick = (e) => {
    this.setState({ defaultPayType: e.target.value });
  }

  onLinkClick = (e) => {
    this.context.router.push(e.currentTarget.dataset.to);
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
    const { prefixCls, payInfo } = this.props;
    const products = payInfo.data.cart_list || [];
    const address = this.props.address.data || {};
    const { pathname, query } = this.props.location;
    return (
      <div className={`${prefixCls}`}>
        <Header title="确认订单" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          <div className={`row no-margin bottom-border ${prefixCls}-address`} data-to={`/user/address?next=${encodeURIComponent(pathname + (query.couponId ? `?couponId=${query.couponId}` : ''))}`} onClick={this.onLinkClick}>
            <i className="col-xs-1 no-padding margin-top-xs icon-location icon-2x icon-yellow-light"></i>
            <div className="col-xs-10">
              <p><span className="margin-right-sm">{address.receiver_name}</span><span>{address.receiver_mobile}</span></p>
              <p className="font-grey-light">{address.receiver_state + address.receiver_city + address.receiver_district + address.receiver_address}</p>
            </div>
            <i className="col-xs-1 no-padding margin-top-28 text-right icon-angle-right icon-grey"></i>
          </div>
          {this.renderProducts(products)}
          <div className={`row no-margin bottom-border margin-top-xs ${prefixCls}-row`} data-to={`/user/coupons?next=${encodeURIComponent(pathname + (query.addressId ? `?addressId=${query.addressId}` : ''))}`} onClick={this.onLinkClick}>
            <p className="col-xs-5 no-padding">可用优惠券</p>
            <p className="col-xs-7 no-padding">
              <span className="col-xs-11 no-padding"></span>
              <i className="col-xs-1 no-padding margin-top-28 text-right icon-angle-right icon-grey"></i>
            </p>
          </div>
          <div className={`row no-margin bottom-border ${prefixCls}-row`}>
            <p className="col-xs-5 no-padding">运费</p>
            <p className="col-xs-7 no-padding text-right">{payInfo.data.post_fee}</p>
          </div>
          <div className={`row no-margin text-right ${prefixCls}-row transparent`}>
            <p className="col-xs-12 no-padding"><span>合计：￥</span><span>{payInfo.data.total_fee}</span></p>
          </div>
        </div>
        <If condition={payInfo.data.alipay_payable}>
          <div className={`row no-margin bottom-border ${prefixCls}-row`}>
            <p className="col-xs-5 no-padding">
              <i className="icon-alipay-square icon-alipay-blue font-xlg margin-right-xxs"></i>
              <span className="inline-block margin-top-5">支付宝</span>
            </p>
            <p className="col-xs-7 no-padding text-right">
              <label className="margin-top-5">
                <Radio value={payType.alipay} checked = {this.state.defaultPayType === payType.alipay} onChange={this.onPayTypeClick} />
              </label>
            </p>
          </div>
        </If>
        <If condition={payInfo.data.weixin_payable}>
          <div className={`row no-margin bottom-border ${prefixCls}-row`}>
            <p className="col-xs-5 no-padding">
              <i className="icon-wechat-pay icon-wechat-green font-xlg margin-right-xxs"></i>
              <span className="inline-block margin-top-5">微信支付</span>
            </p>
            <p className="col-xs-7 no-padding text-right">
              <label className="margin-top-5">
                <Radio value={payType.wechat} checked = {this.state.defaultPayType === payType.wechat} onChange={this.onPayTypeClick} />
              </label>
            </p>
          </div>
        </If>
        <BottomBar size="large">
          <p>
            <span className="font-xs">应付款金额</span>
            <span className="font-lg font-orange">{'￥' + payInfo.data.total_payment}</span>
          </p>
          <button className="button button-energized col-xs-12" type="button" onClick={this.onCommitOrderClick}>购买</button>
        </BottomBar>
      </div>
    );
  }
}
