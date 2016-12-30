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
import { BottomBar } from 'components/BottomBar';
import { If } from 'jsx-control-statements';
import * as utils from 'utils';
import * as constants from 'constants';
import * as mamaInfoAction from 'actions/mama/mamaInfo';
import * as detailsAction from 'actions/product/details';
import * as shopBagAction from 'actions/shopBag';
import * as payInfoAction from 'actions/order/payInfo';
import * as commitOrderAction from 'actions/order/commit';
import * as couponAction from 'actions/user/coupons';
import * as wechatSignAction from 'actions/wechat/sign';
import * as plugins from 'plugins';

import './boutiqueInvite.scss';

const payTypeIcons = {
  wx: 'icon-wechat-pay icon-wechat-green',
  alipay: 'icon-alipay-square icon-alipay-blue',
};

const actionCreators = _.extend(mamaInfoAction, detailsAction, shopBagAction, payInfoAction, commitOrderAction, couponAction, wechatSignAction);

@connect(
  state => ({
    mamaInfo: state.mamaInfo,
    productDetails: state.productDetails,
    payInfo: state.payInfo,
    order: state.commitOrder,
    coupons: state.coupons,
    shopBag: state.shopBag,
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class BoutiqueInvite extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    addProductToShopBag: React.PropTypes.func,
    // fetchPayInfo: React.PropTypes.func,
    // commitOrder: React.PropTypes.func,
    fetchProductDetails: React.PropTypes.func,
    resetProductDetails: React.PropTypes.func,
    resetAddProductToShopBag: React.PropTypes.func,
    fetchBuyNowPayInfo: React.PropTypes.func,
    buyNowCommitOrder: React.PropTypes.func,
    fetchMamaInfo: React.PropTypes.func,
    fetchWechatSign: React.PropTypes.func,
    mamaInfo: React.PropTypes.any,
    shopBag: React.PropTypes.object,
    order: React.PropTypes.object,
    payInfo: React.PropTypes.object,
    coupons: React.PropTypes.object,
    productDetails: React.PropTypes.object,
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
    payTypePopupActive: false,
    chargeEnable: true,
    index: 0,
  }

  componentWillMount() {
    const num = this.props.location.query.num ? this.props.location.query.num : 5;
    let index = 0;
    if (Number(num) === 5) {
      index = 0;
    } else if (Number(num) === 3) {
      index = 1;
    }
    this.setState({ index: index });
    this.props.fetchMamaInfo();
    this.props.fetchProductDetails(25115);
    this.props.fetchWechatSign();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaInfo, productDetails, payInfo, order, coupons, wechatSign } = nextProps;
    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else if (!nextProps.isLoading) {
      utils.ui.loadingSpinner.hide();
    }

    if (wechatSign && wechatSign.success && wechatSign.data && mamaInfo.success && mamaInfo.data) {
      utils.wechat.config(wechatSign);
      const shareInfo = {
        success: true,
        data: {
          title: '邀请您加入精品汇',
          desc: '组建团队，成就梦想，给您准备优质产品和流量支持',
          share_link: 'https://m.xiaolumeimei.com/rest/v1/users/weixin_login/?next=/mall/boutiqueinvite?mama_id=' + mamaInfo.data[0].id,
          share_img: 'http://7xogkj.com2.z0.glb.qiniucdn.com/222-ohmydeer.png?imageMogr2/thumbnail/60/format/png',
        },
      };
      utils.wechat.configShareContent(shareInfo);
    }

    if (mamaInfo.success && mamaInfo.data && mamaInfo.data[0].elite_level && productDetails.success && productDetails.data) {
      for (let i = 0; i < productDetails.data.sku_info.length; i++) {
        this.setState({ sku: productDetails.data.sku_info[0] });
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

  }

  componentWillUnmount() {
    this.props.resetProductDetails();
  }

  onChargeClick = (e) => {
    const { productDetails, mamaInfo } = this.props;
    const { type } = e.currentTarget.dataset;
    const skus = productDetails.data.sku_info;

    if (mamaInfo && mamaInfo.data && (mamaInfo.data.length > 0)) {
      if (mamaInfo.data[0].is_elite_mama) {
        Toast.show('您已经是精英妈妈了，不能再次购买新人券，如需购券，请进入我的微店操作！');
      } else {
        if (this.state.sku) {
          // this.props.addProductToShopBag(this.state.sku.product_id, this.state.sku.sku_items[0].sku_id, this.state.num);
          // 精品券默认是在app上支付
          if (utils.detector.isApp()) {
            this.props.fetchBuyNowPayInfo(this.state.sku.sku_items[this.state.index].sku_id, 1, 'app');
          } else {
            this.props.fetchBuyNowPayInfo(this.state.sku.sku_items[this.state.index].sku_id, 1, 'wap');
          }
          this.setState({ chargeEnable: false });
        } else {
          Toast.show('商品信息获取不全');
        }
      }
    }
  }

  onPayTypeClick = (e) => {
    const { payInfo, mamaInfo } = this.props;
    const { paytype } = e.currentTarget.dataset;
    const mmLinkId = mamaInfo.data ? mamaInfo.data[0].id : 0;
    const referalMamaid = this.props.location.query.mama_id ? this.props.location.query.mama_id : mmLinkId;

    console.log(referalMamaid);
    this.setState({ payTypePopupActive: false });

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
      num: 1,
      payment: payInfo.data.total_payment,
      post_fee: payInfo.data.post_fee,
      discount_fee: payInfo.data.discount_fee,
      total_fee: payInfo.data.total_fee,
      channel: paytype,
      mm_linkid: referalMamaid,
      order_type: 4, // 对应后台的电子商品类型，不校验地址
    });

    e.preventDefault();
  }

  onAdministratorClick = (e) => {
    this.context.router.push('/mama/open/succeed');
    e.preventDefault();
  }

  togglePayTypePopupActive = () => {
      this.setState({ payTypePopupActive: false, chargeEnable: true });
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
    this.setState({ payTypePopupActive: false });
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
        console.log(result, error);
        Toast.show('支付失败');
        window.location.replace(`${data.fail_url}`);
      });
    }

  }

  render() {
    const { mamaInfo, shopBag } = this.props;
    const imgSrc = (this.state.productDetail && this.state.productDetail.detail_content) ? this.state.productDetail.detail_content.head_img : '';
    const payInfo = this.payInfo();
    const sku = this.state.sku ? this.state.sku : null;
    const trasparentHeader = true;
    const disabled = false;

    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-2 no-padding content-white-bg boutique-invite">
        <Header trasparent={trasparentHeader} title="邀请您加入精品汇" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="invite-imgs">
          <Image className="coupon-img" src={constants.image.imageUrl + '/mall/mama/invite/boutique_01.png'} quality={70} />
          <If condition={this.state.index === 0}>
          <Image className="coupon-img" src={constants.image.imageUrl + '/mall/mama/invite/boutique_02.png'} quality={70} />
          </If>
          <If condition={this.state.index === 1}>
          <Image className="coupon-img" src={constants.image.imageUrl + '/mall/mama/invite/boutique_02_2.png'} quality={70} />
          </If>
          <Image className="coupon-img" src={constants.image.imageUrl + '/mall/mama/invite/boutique_03.png'} quality={70} />
          <Image className="coupon-img" src={constants.image.imageUrl + '/mall/mama/invite/boutique_04.png'} quality={70} />
          <Image className="coupon-img" src={constants.image.imageUrl + '/mall/mama/invite/boutique_05.png'} quality={70} />
          <Image className="coupon-img" src={constants.image.imageUrl + '/mall/mama/invite/boutique_06.jpg'} quality={70} />
        </div>
        <BottomBar className="clearfix" size="medium">
            <button className="button col-xs-4 col-xs-offset-1 no-padding font-orange" type="button" data-type={`单独购买`} onClick={this.onAdministratorClick} disabled={disabled}>
              {'咨询管理员'}
            </button>
            <button className="button button-energized col-xs-4 col-xs-offset-1 no-padding" type="button" data-type={3} onClick={this.onChargeClick} disabled={!this.state.chargeEnable}>
              {'直接支付'}
            </button>
          </BottomBar>
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
