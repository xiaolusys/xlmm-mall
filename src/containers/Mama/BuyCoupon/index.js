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
import * as mamaInfoAction from 'actions/mama/mamaInfo';
import * as detailsAction from 'actions/product/details';
import * as shopBagAction from 'actions/shopBag';
import * as payInfoAction from 'actions/order/payInfo';
import * as commitOrderAction from 'actions/order/commit';
import * as plugins from 'plugins';

import './index.scss';

const payTypeIcons = {
  wx_pub: 'icon-wechat-pay icon-wechat-green',
  alipay_wap: 'icon-alipay-square icon-alipay-blue',
};

const actionCreators = _.extend(mamaInfoAction, detailsAction, shopBagAction, payInfoAction, commitOrderAction);

@connect(
  state => ({
    mamaInfo: state.mamaInfo,
    productDetails: state.productDetails,
    shopBag: state.shopBag,
    payInfo: state.payInfo,
    order: state.commitOrder,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class BuyCoupon extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    fetchProductDetails: React.PropTypes.func,
    addProductToShopBag: React.PropTypes.func,
    fetchPayInfo: React.PropTypes.func,
    commitOrder: React.PropTypes.func,
    fetchMamaInfo: React.PropTypes.func,
    mamaInfo: React.PropTypes.any,
    productDetails: React.PropTypes.object,
    shopBag: React.PropTypes.object,
    order: React.PropTypes.object,
    payInfo: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    payTypePopupActive: false,
    num: 5,
  }

  componentWillMount() {
    this.props.fetchProductDetails(23487);
    this.props.fetchMamaInfo();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaInfo, productDetails, shopBag, payInfo, order } = nextProps;
    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else if (!nextProps.isLoading) {
      utils.ui.loadingSpinner.hide();
    }

    // Add product resp
    if (this.props.shopBag.addProduct.isLoading) {
      if (nextProps.shopBag.addProduct.success && nextProps.shopBag.addProduct.data.code === 0) {
        Toast.show(nextProps.shopBag.addProduct.data.info);
        this.setState({ activeSkuPopup: false });
      }
      if (nextProps.shopBag.addProduct.success && nextProps.shopBag.addProduct.data.info) {
        Toast.show(nextProps.shopBag.addProduct.data.info);
      }

      if (nextProps.shopBag.addProduct.error) {
        switch (nextProps.shopBag.addProduct.status) {
          case 403:
            if (utils.detector.isApp()) {
              plugins.invoke({ method: 'jumpToNativeLogin' });
              return;
            }
            this.context.router.push(`/user/login?next=${encodeURIComponent(this.props.location.pathname + this.props.location.search)}`);
            return;
          case 500:
            Toast.show(nextProps.shopBag.addProduct.data.detail);
            break;
          default:
            Toast.show(nextProps.shopBag.addProduct.data.detail);
            break;
        }
      }
    }

    // query shopbag resp
    if (this.props.shopBag.shopBag.isLoading) {
      if (shopBag.shopBag.success && !_.isEmpty(shopBag.shopBag.data)) {
        const cartIds = shopBag.shopBag.data[0].id;
        this.props.fetchPayInfo(cartIds);
      }
    }

    // payinfo resp
    if (this.props.payInfo.isLoading) {
      // pop pay
      if (payInfo.success && !_.isEmpty(payInfo.data)) {
        this.setState({ payTypePopupActive: true });
      }
    }

    // commit order resp
    if (this.props.order.isLoading) {
      if (order.success && !_.isEmpty(order.data) && order.data.code === 0) {
          this.pay(order.data);
      }

      if (order.success && !_.isEmpty(order.data) && order.data.code !== 0) {
          Toast.show(order.data.info);
      }
    }

  }

  componentWillUnmount() {

  }

  onChargeClick = (e) => {
    const { productDetails } = this.props;
    const { type } = e.currentTarget.dataset;
    const skus = productDetails.data.sku_info;

    this.props.addProductToShopBag(skus[0].product_id, skus[0].sku_items[0].sku_id, this.state.num);
  }

  onPayTypeClick = (e) => {
    const { payInfo, mamaInfo } = this.props;
    const { paytype } = e.currentTarget.dataset;
    const mmLinkId = mamaInfo.data ? mamaInfo.data.id : 0;

    if (mmLinkId === 0) {
      Toast.show('小鹿妈妈信息获取不全，请重进此页面！！');
      e.preventDefault();
      return;
    }

    this.props.commitOrder({
      uuid: payInfo.data.uuid,
      cart_ids: payInfo.data.cart_ids,
      payment: payInfo.data.total_payment,
      post_fee: payInfo.data.post_fee,
      discount_fee: payInfo.data.discount_fee,
      total_fee: payInfo.data.total_fee,
      channel: paytype,
      mm_linkid: mmLinkId,
      order_type: 4, // 对应后台的电子商品类型，不校验地址
    });
    e.preventDefault();
  }

  onUpdateQuantityClick = (e) => {
    const { action } = e.currentTarget.dataset;
    if (action === 'minus' && Number(this.state.num) === 1) {
      e.preventDefault();
      return false;
    }
    switch (action) {
      case 'plus':
        this.setState({ num: this.state.num + 1 });
        break;
      case 'minus':
      this.setState({ num: this.state.num - 1 });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  togglePayTypePopupActive = () => {
      this.setState({ payTypePopupActive: !this.state.payTypePopupActive });
  }

  payInfo = () => {
    let payInfo = {};
    if (!_.isEmpty(this.props.payInfo.data)) {
      payInfo = this.props.payInfo.data;
      /* payInfo.channels = [];
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
      }*/
    }
    return payInfo;
  }

  pay = (data) => {
    this.setState({ payTypePopupActive: !this.state.payTypePopupActive });
    window.pingpp.createPayment(data.charge, (result, error) => {
      if (result === 'success') {
        Toast.show('支付成功');
        window.location.replace(`${data.success_url}`);
        return;
      }
      Toast.show('支付失败');
      window.location.replace(`${data.fail_url}`);
    });
  }

  render() {
    const { productDetails } = this.props;
    const imgSrc = (productDetails.data && productDetails.data.detail_content) ? productDetails.data.detail_content.head_img : '';
    const payInfo = this.payInfo();
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding content-white-bg buycoupon">
        <Image className="coupon-img" src={imgSrc} quality={70} />
        <div className="row coupon-num">
          <p className="text-center cart-quantity">
            <i className="icon-minus icon-yellow" data-action="minus" onClick={this.onUpdateQuantityClick}></i>
            <span>{this.state.num}</span>
            <i className="icon-plus icon-yellow" data-action="plus" onClick={this.onUpdateQuantityClick}></i>
          </p>
        </div>
        <div>
          <p className="col-xs-offset-1">规则说明：本精品优惠券仅限专业版小鹿妈妈购买及流通使用。</p>
        </div>
        <div className="row no-margin text-center margin-bottom-xs">
          <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onChargeClick}>支付</button>
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
              <div className="bottom-border pay-type-item" key={channel.id} data-paytype={channel.id} onClick={this.onPayTypeClick}>
                <i className={`${payTypeIcons[channel.id]} icon-2x margin-right-xxs`}></i>
                <span className="inline-block margin-top-xxs">{channel.name}</span>
              </div>
            )
          )}
        </Popup>
      </div>
    );
  }
}
