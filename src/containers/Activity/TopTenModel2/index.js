import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as wechatSignAction from 'actions/wechat/sign';
import * as shareActivityAction from 'actions/share/activity';
import * as couponAction from 'actions/user/coupon';
import * as topTenAction from 'actions/activity/topTen';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';
import { WechatPopup } from 'components/WechatPopup';

import './index.scss';

const actionCreators = _.extend(wechatSignAction, shareActivityAction, couponAction, topTenAction);

const setupWebViewJavascriptBridge = function(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
};

@connect(
  state => ({
    data: state.coupon.data,
    isLoading: state.coupon.isLoading,
    success: state.coupon.success,
    error: state.coupon.error,
    shareActivity: state.shareActivity,
    wechatSign: state.wechatSign,
    topTen: state.topTen,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class TopTenModel2 extends Component {

  static propTypes = {
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    location: React.PropTypes.object,
    receiveCoupon: React.PropTypes.func,
    fetchShareActivityInfo: React.PropTypes.func,
    fetchWechatSign: React.PropTypes.func,
    resetCoupon: React.PropTypes.func,
    topTen: React.PropTypes.obejct,
    shareActivity: React.PropTypes.obejct,
    fetchTopTen: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    popupActive: false,
  }

  componentWillMount() {
    const activityId = this.props.location.query.id;
    this.props.fetchWechatSign();
    this.props.fetchShareActivityInfo(activityId);
    this.props.fetchTopTen(activityId);
  }

  componentWillReceiveProps(nextProps) {
    utils.wechat.config(nextProps.wechatSign);
    utils.wechat.configShareContent({
      success: nextProps.shareActivity.success,
      data: {
        title: nextProps.shareActivity.data.title,
        desc: nextProps.shareActivity.data.active_dec,
        link: nextProps.shareActivity.data.share_link,
        imgUrl: nextProps.shareActivity.data.share_icon,
      },
    });
    if (nextProps.success) {
      console.log('nextprops succ');
      Toast.show({
        message: nextProps.data.res,
        position: Toast.POSITION_MIDDLE,
      });
    }
    if (nextProps.error && !nextProps.isLoading) {
      if (utils.detector.isApp() && utils.detector.isIOS()) {
        plugins.invoke({ method: 'jumpToNativeLogin' });
      } else if (utils.detector.isApp() && utils.detector.isAndroid()) {
        window.AndroidBridge.callNativeLoginActivity(window.location.href);
      } else {
        this.context.router.replace(`/user/login?next=${this.props.location.pathname}`);
      }
    }
  }

  componentWillUnmount() {
    this.props.resetCoupon();
  }

  onCouponClick = (e) => {
    const activityId = this.props.location.query.id;
    const couponId = e.currentTarget.dataset.couponid;
    const modelData = this.props.topTen.data || {};
    const index = e.currentTarget.dataset.index;
    const jumpUrl = modelData.coupons[index].jumpUrl;
    if (modelData.coupons[index].isReceived) {
      console.log('aa');

      if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
        const appVersion = Number(window.AndroidBridge.appVersion()) || 0;
        if (appVersion < 20160528 || appVersion >= 20160815) {
          window.AndroidBridge.jumpToNativeLocation(jumpUrl);
          return;
        }
        if (utils.detector.isApp()) {
          plugins.invoke({
            method: 'jumpToNativeLocation',
            data: { target_url: jumpUrl },
          });
          return;
        }
      }
      if (utils.detector.isIOS() && utils.detector.isApp()) {
        plugins.invoke({
          method: 'jumpToNativeLocation',
          data: { target_url: jumpUrl },
        });
        return;
      }
      if (utils.detector.isIOS() && !utils.detector.isWechat()) {
        setupWebViewJavascriptBridge(function(bridge) {
          bridge.callHandler('jumpToNativeLocation', {
            target_url: jumpUrl,
          }, function(response) {});
        });
        return;
      }
      if (modelData.coupons[index].jumpUrl.indexOf('activity_id') > 0) {
        window.location.href = jumpUrl.substr(jumpUrl.indexOf('/mall/'));
      } else {
        window.location.href = `/mall/product/list?${jumpUrl.split('?')[1]}&title="分类"`;
      }
    } else {
      console.log('bb');
      this.props.receiveCoupon(Number(couponId), activityId);
    }
  }

  onProductClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    const modelId = Number(dataSet.modelid);
    const appUrl = 'com.jimei.xlmm://app/v1/products/modelist?model_id=' + modelId;
    if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
      const appVersion = Number(window.AndroidBridge.appVersion()) || 0;
      if (appVersion < 20160528 || appVersion >= 20160815) {
        window.AndroidBridge.jumpToNativeLocation(appUrl);
        return;
      }
      if (utils.detector.isApp()) {
        plugins.invoke({
          method: 'jumpToNativeLocation',
          data: { target_url: 'com.jimei.xlmm://app/v1/products?product_id=' + window.location.href.substr(0, window.location.href.indexOf('/mall/')) + '/mall/product/details/' + modelId },
        });
        return;
      }
    }
    if (utils.detector.isIOS() && utils.detector.isApp()) {
      plugins.invoke({
        method: 'jumpToNativeLocation',
        data: { target_url: 'com.jimei.xlmm://app/v1/products?product_id=' + window.location.href.substr(0, window.location.href.indexOf('/mall/')) + '/mall/product/details/' + modelId },
      });
      return;
    }
    if (utils.detector.isIOS() && !utils.detector.isWechat()) {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('jumpToNativeLocation', {
          target_url: appUrl,
        }, function(response) {});
      });
      return;
    }
    window.location.href = `/mall/product/details/${modelId}`;
  }

  onShareBtnClick = (e) => {
    const { shareActivity } = this.props;
    const shareData = {
      share_title: shareActivity.data.title,
      share_to: '',
      share_desc: shareActivity.data.active_dec,
      share_icon: shareActivity.data.share_icon,
      share_type: 'link',
      link: shareActivity.data.share_link,
    };

    if (utils.detector.isWechat()) {
      this.setState({ popupActive: true });
      return;
    }

    if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
      const appVersion = Number(window.AndroidBridge.appVersion && window.AndroidBridge.appVersion()) || 0;
      if (appVersion < 20160528) {
        window.AndroidBridge.callNativeUniShareFunc(shareData);
        return;
      }
      if (utils.detector.isApp()) {
        plugins.invoke({
          method: 'callNativeUniShareFunc',
          data: shareData,
        });
        return;
      }
    }
    if (utils.detector.isIOS() && utils.detector.isApp()) {
      plugins.invoke({
        method: 'callNativeUniShareFunc',
        data: shareData,
      });
      return;
    }
    if (utils.detector.isIOS() && !utils.detector.isWechat()) {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('callNativeUniShareFunc', shareData, function(response) {});
      });
      return;
    }
  }

  onCloseBtnClick = (e) => {
    this.setState({ popupActive: false });
  }

  render() {
    const modelData = this.props.topTen.data || {};
    return (
      <div>
        <Header title={modelData.title} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()} />
        <div className="content activity-topTen-model-2 bg-white">
          <Image quality={50} className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={modelData.banner} />
          <If condition={!_.isEmpty(modelData.coupons)}>
            <ul className="coupon-list">
              {modelData.coupons.map((coupon, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3 no-padding margin-bottom-xs" key={index} data-index={index} data-couponid={coupon.couponId} onClick={this.onCouponClick}>
                    <Image quality={50} className="col-xs-12 no-padding" src={coupon.isReceived ? coupon.getAfterPic : coupon.getBeforePic} />
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={!_.isEmpty(modelData.topics)}>
            <ul>
              {modelData.topics.map((item, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3 no-padding margin-bottom-xs" key={index}>
                    <Link to="">
                      <Image quality={50} className="col-xs-12 no-padding" src={item.pic} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={!_.isEmpty(modelData.category)}>
            <ul>
              {modelData.category.map((item, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3 no-padding margin-bottom-xs" key={index} data-couponid={item.couponId} onClick={this.onCouponClick}>
                    <Image quality={50} className="col-xs-12 no-padding" src={item.getBeforePic} />
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={!_.isEmpty(modelData.productsHorizental)}>
            <ul className="products-horizental-list">
              {modelData.productsHorizental.map((product, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3 margin-bottom-xxs" key={index}>
                    <div className="row no-margin">
                      <Image quality={50} src={product.pic} data-modelid={product.modelId} onClick={this.onProductClick}/>
                      <div className="row no-margin">
                        <div className="col-xs-8">
                          <p className="row no-margin no-wrap">{product.productName}</p>
                          <p className="row no-margin">
                            <span className="actual-pice">{`¥${product.lowestPrice}`}</span>
                            <span className="original-price font-grey-light text-line-through">{product.stdPrice}</span>
                          </p>
                        </div>
                        <div className="col-xs-4">
                          <p className="no-margin buy-immediately" data-modelid={product.modelId} onClick={this.onProductClick}>立即抢购</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={!_.isEmpty(modelData.productsVertical)}>
            <ul className="row no-margin products-vertical-list">
              {modelData.productsVertical.map((product, index) => {
                return (
                  <li className="col-xs-6">
                    <div className="row no-margin margin-top-xxs">
                      <Image quality={50} thumbnail={352} crop="352x681" src={product.pic} key={index} data-modelid={product.modelId} onClick={this.onProductClick}/>
                      <div className="row no-margin product-details">
                        <p className="col-xs-12 no-margin no-padding no-wrap">{product.productName}</p>
                        <p className="col-xs-12 no-margin no-padding">
                          <span className="actual-pice">{`¥${product.lowestPrice}`}</span>
                          <span className="original-price font-grey-light text-line-through">{product.stdPrice}</span>
                        </p>
                        <p className="col-xs-12 no-margin no-padding buy-immediately" data-modelid={product.modelId} onClick={this.onProductClick}>立即抢购</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </If>
          <Image quality={50} className="col-xs-6 col-xs-offset-3 margin-top-md no-padding act-share" src={modelData.shareBtn} onClick={this.onShareBtnClick}/>
        </div>
        <WechatPopup active={this.state.popupActive} onCloseBtnClick={this.onCloseBtnClick}/>
      </div>
    );
  }
}
