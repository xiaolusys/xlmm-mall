import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as wechatSignAction from 'actions/wechat/sign';
import * as shareActivityAction from 'actions/share/activity';
import * as couponAction from 'actions/user/coupon';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';
import activity from './activity';
import { WechatPopup } from 'components/WechatPopup';

import './index.scss';

const actionCreators = _.extend(wechatSignAction, shareActivityAction, couponAction);

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
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class A20160701 extends Component {

  static propTypes = {
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    location: React.PropTypes.object,
    receiveCoupon: React.PropTypes.func,
    fetchShareActivityInfo: React.PropTypes.func,
    fetchWechatSign: React.PropTypes.func,
    resetCoupon: React.PropTypes.func,
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
    this.props.fetchWechatSign();
    this.props.fetchShareActivityInfo(activity.activityId);
  }

  componentWillReceiveProps(nextProps) {
    utils.wechat.config(nextProps.wechatSign);
    utils.wechat.configShareContent({
      success: nextProps.shareActivity.success,
      data: {
        title: nextProps.shareActivity.data.title,
        desc: nextProps.shareActivity.data.active_dec,
        share_link: nextProps.shareActivity.data.share_link,
        share_img: nextProps.shareActivity.data.share_icon,
      },
    });
    if (nextProps.success) {
      Toast.show({
        message: nextProps.data.res,
        position: Toast.POSITION_MIDDLE,
      });
    }
    if (nextProps.error && !nextProps.isLoading) {
      this.context.router.replace(`/user/login?next=${this.props.location.pathname}`);
    }
  }

  componentWillUnmount() {
    this.props.resetCoupon();
  }

  onCouponClick = (e) => {
    const couponId = e.currentTarget.dataset.couponid;
    this.props.receiveCoupon(Number(couponId));
  }

  onProductClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    const modelId = Number(dataSet.modelid);
    const appUrl = 'com.jimei.xlmm://app/v1/products/modelist?model_id=' + modelId;
    if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
      const appVersion = Number(window.AndroidBridge.appVersion && window.AndroidBridge.appVersion()) || 0;
      if (appVersion < 20160528) {
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
    this.context.router.push(`/product/details/${modelId}`);
  }

  onShareBtnClick = (e) => {
    const data = {
      share_to: '',
      active_id: activity.activityId,
    };

    if (utils.detector.isWechat()) {
      this.setState({ popupActive: true });
      return;
    }

    if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
      const appVersion = Number(window.AndroidBridge.appVersion && window.AndroidBridge.appVersion()) || 0;
      if (appVersion < 20160528) {
        window.AndroidBridge.callNativeUniShareFunc(data.share_to, data.active_id);
        return;
      }
      if (utils.detector.isApp()) {
        plugins.invoke({
          method: 'callNativeUniShareFunc',
          data: data,
        });
        return;
      }
    }
    if (utils.detector.isIOS() && utils.detector.isApp()) {
      plugins.invoke({
        method: 'callNativeUniShareFunc',
        data: data,
      });
      return;
    }
    if (utils.detector.isIOS() && !utils.detector.isWechat()) {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('callNativeUniShareFunc', data, function(response) {});
      });
      return;
    }
  }

  onCloseBtnClick = (e) => {
    this.setState({ popupActive: false });
  }

  render() {
    return (
      <div>
        <Header title="俏丽素人" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()} />
          <div className="content clearfix activity-top10">
            <Image className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={activity.banner} />
            <ul>
              {activity.coupons.map((coupon, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3 no-padding margin-bottom-xs" key={index} data-couponid={coupon.couponId} onClick={this.onCouponClick}>
                    <Image className="col-xs-12 no-padding" src={coupon.pic} />
                  </li>
                );
              })}
            </ul>
            <ul className="margin-top-xs">
              {activity.productsGroupH.map((product, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3 margin-bottom-xxs" key={index} data-modelid={product.modelId} onClick={this.onProductClick}>
                    <Image src={product.pic} />
                  </li>
                );
              })}
            </ul>
            <ul className="product-list-vertical">
              {activity.productsGroupV.map((product, index) => {
                return (
                  <Image className="col-xs-6" thumbnail={352} crop="352x681" src={product.pic} key={index} data-modelid={product.modelId} onClick={this.onProductClick}/>
                );
              })}
            </ul>
            <Image className="col-xs-6 col-xs-offset-3 margin-top-md no-padding act-share" src={activity.shareBtn} onClick={this.onShareBtnClick}/>
          </div>
          <WechatPopup active={this.state.popupActive} onCloseBtnClick={this.onCloseBtnClick}/>
      </div>
    );
  }
}
