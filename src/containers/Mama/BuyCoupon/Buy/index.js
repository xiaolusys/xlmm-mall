import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Header } from 'components/Header';
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
import * as couponAction from 'actions/user/coupons';
import * as plugins from 'plugins';

import './index.scss';

const payTypeIcons = {
  wx: 'icon-wechat-pay icon-wechat-green',
  alipay: 'icon-alipay-square icon-alipay-blue',
};

const actionCreators = _.extend(mamaInfoAction, detailsAction, shopBagAction, payInfoAction, commitOrderAction, couponAction);

@connect(
  state => ({
    mamaInfo: state.mamaInfo,
    productDetails: state.productDetails,
    payInfo: state.payInfo,
    order: state.commitOrder,
    coupons: state.coupons,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class BuyCoupon extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    // addProductToShopBag: React.PropTypes.func,
    // fetchPayInfo: React.PropTypes.func,
    // commitOrder: React.PropTypes.func,
    fetchProductDetails: React.PropTypes.func,
    fetchBuyNowPayInfo: React.PropTypes.func,
    buyNowCommitOrder: React.PropTypes.func,
    fetchMamaInfo: React.PropTypes.func,
    applyNegotiableCoupons: React.PropTypes.func,
    mamaInfo: React.PropTypes.any,
    shopBag: React.PropTypes.object,
    order: React.PropTypes.object,
    payInfo: React.PropTypes.object,
    coupons: React.PropTypes.object,
    productDetails: React.PropTypes.object,
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
    chargeEnable: true,
  }

  componentWillMount() {
    const { query } = this.props.location;

    this.props.fetchMamaInfo();
    this.props.fetchProductDetails(query.modelid);
  }

  componentWillReceiveProps(nextProps) {
    const { mamaInfo, productDetails, payInfo, order, coupons } = nextProps;
    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else if (!nextProps.isLoading) {
      utils.ui.loadingSpinner.hide();
    }

    if (mamaInfo.success && mamaInfo.data && mamaInfo.data[0].elite_level && productDetails.success && productDetails.data) {
      for (let i = 0; i < productDetails.data.sku_info.length; i++) {
        if (productDetails.data.sku_info[i].name.indexOf(mamaInfo.data[0].elite_level) >= 0) {
          this.setState({ sku: productDetails.data.sku_info[i] });
        }
      }
    }

    if (productDetails.success && productDetails.data && this.props.productDetails.isLoading) {
      this.setState({ productDetail: productDetails.data });
    }

    // Add product resp
    /*
    if (this.props.shopBag.addProduct.isLoading) {
      if (nextProps.shopBag.addProduct.success && nextProps.shopBag.addProduct.data.code === 0) {
        // Toast.show(nextProps.shopBag.addProduct.data.info);
        this.setState({ activeSkuPopup: false });
      }
      if (nextProps.shopBag.addProduct.success && (nextProps.shopBag.addProduct.data.code !== 0)
          && nextProps.shopBag.addProduct.data.info) {
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
    }*/

    // payinfo resp
    if (this.props.payInfo.isLoading) {
      if (payInfo.error) {
        this.setState({ chargeEnable: true });
        Toast.show('获取支付信息错误');
      }
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
          this.setState({ chargeEnable: true });
          Toast.show(order.data.info);
      }
    }

    // apply coupon
    if (this.props.coupons.applynegotiable.isLoading) {
      if (coupons.applynegotiable.success && !_.isEmpty(coupons.applynegotiable.data) && coupons.applynegotiable.data.code === 0) {
          Toast.show('申请精品券成功');
          window.location.href = window.location.origin + '/tran_coupon/html/trancoupon.html';
      }

      if (coupons.applynegotiable.success && !_.isEmpty(coupons.applynegotiable.data) && coupons.applynegotiable.data.code !== 0) {
          Toast.show(coupons.applynegotiable.data.info);
      }
    }

  }

  componentWillUnmount() {

  }

  onChargeClick = (e) => {
    const { productDetails, mamaInfo } = this.props;
    const { type } = e.currentTarget.dataset;
    const skus = productDetails.data.sku_info;

    if (this.state.num <= 0) {
      Toast.show('对不起，输入的商品个数不对，请重新输入');
      return;
    }

    if (this.props.productDetails.data.extras.min_buy_num
      && Number(this.state.num) < this.props.productDetails.data.extras.min_buy_num) {
      Toast.show('特卖商品券购买个数不能小于最低购买张数' + this.props.productDetails.data.extras.min_buy_num);
      return;
    }

    if (mamaInfo && mamaInfo.data && (mamaInfo.data.length > 0) && mamaInfo.data[0].charge_status === 'charged'
        && (mamaInfo.data[0].is_elite_mama) && mamaInfo.data[0].is_buyable) {
      if (this.state.sku) {
        // this.props.addProductToShopBag(this.state.sku.product_id, this.state.sku.sku_items[0].sku_id, this.state.num);
        // 精品券默认是在app上支付
        if (utils.detector.isApp()) {
          this.props.fetchBuyNowPayInfo(this.state.sku.sku_items[0].sku_id, this.state.num, 'app');
        } else {
          this.props.fetchBuyNowPayInfo(this.state.sku.sku_items[0].sku_id, this.state.num, 'wap');
        }
      } else {
        Toast.show('商品信息获取不全');
      }
    } else {
      // Toast.show('对不起，只有专业版精英小鹿妈妈才能购买此精品券，请先加入精英妈妈！！');
      if (this.state.sku) {
        this.props.applyNegotiableCoupons(this.state.sku.product_id, this.state.num);
      } else {
        Toast.show('商品信息获取不全');
      }
    }
    this.setState({ chargeEnable: false });
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

    /* this.props.commitOrder({
      uuid: payInfo.data.uuid,
      cart_ids: payInfo.data.cart_ids,
      payment: payInfo.data.total_payment,
      post_fee: payInfo.data.post_fee,
      discount_fee: payInfo.data.discount_fee,
      total_fee: payInfo.data.total_fee,
      channel: paytype,
      mm_linkid: mmLinkId,
      order_type: 4, // 对应后台的电子商品类型，不校验地址
    });*/

    this.props.buyNowCommitOrder({
      uuid: payInfo.data.uuid,
      item_id: payInfo.data.sku.product.id,
      sku_id: payInfo.data.sku.id,
      num: this.state.num,
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
        if (this.props.productDetails.data.extras.min_buy_num
          && Number(this.state.num - 1) < this.props.productDetails.data.extras.min_buy_num) {
          Toast.show('特卖商品券购买个数不能小于最低购买张数' + this.props.productDetails.data.extras.min_buy_num);
          break;
        }
        this.setState({ num: this.state.num - 1 });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onNumChange = (value) => {
    if (Number(value.target.value) >= 10000) {
      Toast.show('输入个数不能为0或超过10000');
      return;
    }

    if (this.props.productDetails.data.extras.min_buy_num && (Number(value.target.value) > 0)
        && Number(value.target.value) < this.props.productDetails.data.extras.min_buy_num) {
      Toast.show('特卖商品券购买个数不能小于最低购买张数' + this.props.productDetails.data.extras.min_buy_num);
      return;
    }

    this.setState({ num: Number(value.target.value) });
  }

  togglePayTypePopupActive = () => {
      this.setState({ payTypePopupActive: !this.state.payTypePopupActive, chargeEnable: true });
  }

  payInfo = () => {
    let payInfo = {};
    if (this.props.payInfo.success && (!_.isEmpty(this.props.payInfo.data))) {
      payInfo = this.props.payInfo.data;
      payInfo.channels = [];
      if (utils.detector.isApp()) {
        payInfo.channels.push({
          id: 'wx',
          icon: 'icon-wechat-pay icon-wechat-green',
          name: '微信支付',
        });

        payInfo.channels.push({
          id: 'alipay',
          icon: 'icon-alipay-square icon-alipay-blue',
          name: '支付宝',
        });
      } else {
        payInfo.channels.push({
          id: 'wx_pub',
          icon: 'icon-wechat-pay icon-wechat-green',
          name: '微信支付',
        });

        payInfo.channels.push({
          id: 'alipay_wap',
          icon: 'icon-alipay-square icon-alipay-blue',
          name: '支付宝',
        });
      }
    }
    return payInfo;
  }

  pay = (data) => {
    this.setState({ payTypePopupActive: !this.state.payTypePopupActive });
    if (utils.detector.isApp()) {
      plugins.invoke({
        method: 'callNativePurchase',
        data: data,
      });
    } else {
      window.pingpp.createPayment(data.charge, (result, error) => {
        if (result === 'success') {
          Toast.show('支付成功');
          window.location.href = `${data.success_url}`;
          return;
        }
        Toast.show('支付失败');
        window.location.replace(`${data.fail_url}`);
      });
    }

  }

  render() {
    const { mamaInfo } = this.props;
    const imgSrc = (this.state.productDetail && this.state.productDetail.detail_content) ? this.state.productDetail.detail_content.head_img : '';
    const payInfo = this.payInfo();
    const sku = this.state.sku ? this.state.sku : null;
    const trasparentHeader = true;

    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding content-white-bg buycoupon">
        <Header trasparent={trasparentHeader} title="入券" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <Image className="coupon-img" src={imgSrc} quality={70} />
        <div className="product-info bottom-border bg-white col-xs-offset-1">
          <div className="row no-margin">
            <p className="col-xs-10 no-padding font-md">{(this.state.productDetail && this.state.productDetail.detail_content && sku) ? this.state.productDetail.detail_content.name + '/' + sku.name : '' }</p>
          </div>
          <div className="row no-margin">
            <p className="no-padding">
              <span className="font-32">{'￥' + (sku ? sku.agent_price : '')}</span>
              <span className="font-grey">/</span>
              <span className="font-xs font-grey-light text-line-through">{'￥' + (sku ? sku.std_sale_price : '')}</span>
              <span className="font-grey font-xs" style={{ paddingLeft: '8px' }}>{(sku) ? '积分' + sku.elite_score : ''}</span>
            </p>
          </div>
        </div>
        <div className="row coupon-num">
          <div className="text-center cart-quantity">
            <i className="icon-minus icon-yellow" data-action="minus" onClick={this.onUpdateQuantityClick}></i>
            <input className="input-num" type="number" value={this.state.num} required pattern="[1-9][0-9]*$" onChange={this.onNumChange} />
            <i className="icon-plus icon-yellow" data-action="plus" onClick={this.onUpdateQuantityClick}></i>
          </div>
        </div>
        <div>
          <p className="col-xs-offset-1">规则说明：本精品优惠券仅限专业版精英小鹿妈妈购买及流通使用。</p>
        </div>
        <div className="row no-margin text-center margin-bottom-xs">
          <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onChargeClick} disabled={!this.state.chargeEnable}>{(mamaInfo.success && mamaInfo.data && mamaInfo.data[0].is_elite_mama) ? '支付' : '申请'}</button>
        </div>
        <Popup active={this.state.payTypePopupActive} className="pay-type-popup">
          <div className="row no-margin bottom-border">
            <i className="col-xs-1 no-padding icon-close font-orange" onClick={this.togglePayTypePopupActive}></i>
            <p className="col-xs-11 no-padding text-center">
              <span className="font-xs">应付款金额</span>
              <span className="font-lg font-orange">{`￥${payInfo.total_payment && payInfo.total_payment.toFixed(2)}`}</span>
            </p>
          </div>
          {payInfo.channels && (payInfo.channels.length > 0) && payInfo.channels.map((channel) =>
            (
              <div className="bottom-border pay-type-item" key={channel.id} data-paytype={channel.id} onClick={this.onPayTypeClick}>
                <If condition={channel.id.indexOf('wx') >= 0 }>
                  <i className={`${payTypeIcons.wx} icon-2x margin-right-xxs`}></i>
                </If>
                <If condition={channel.id.indexOf('alipay') >= 0 }>
                  <i className={`${payTypeIcons.alipay} icon-2x margin-right-xxs`}></i>
                </If>
                <span className="inline-block margin-top-xxs">{channel.name}</span>
              </div>
            )
          )}
        </Popup>
      </div>
    );
  }
}
