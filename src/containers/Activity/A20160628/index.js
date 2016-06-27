import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/user/coupon';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';
import activity from './activity';

import './index.scss';

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
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class A20160628 extends Component {

  static propTypes = {
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    location: React.PropTypes.object,
    receiveCoupon: React.PropTypes.func,
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
    redpacketOpened: false,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      if (nextProps.data.code === 0) {
        this.toggleRedpacketOpenedState();
      }
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

  render() {
    return (
      <div>
        <Header title="俏丽素人" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()} />
          <div className="content clearfix activity-top10">
            <Image className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={activity.banner} />
            <ul className="no-margin coupon-list">
              {activity.coupons.map((coupon, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3 margin-bottom-xs" key={index} data-couponid={coupon.couponId} onClick={this.onCouponClick}>
                    <Image className="col-xs-12 no-padding" src={coupon.pic} />
                  </li>
                );
              })}
            </ul>
            <ul className="no-margin product-list1">
              {activity.productsGroup1.map((product, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3 margin-bottom-xxs" key={index} data-modelid={product.modelId} onClick={this.onProductClick}>
                    <Image src={product.pic} />
                  </li>
                );
              })}
            </ul>
            <ul className="no-margin product-list2">
              {activity.productsGroup2.map((product, index) => {
                return (
                  <Image className="col-xs-6" src={product.pic} key={index} data-modelid={product.modelId} onClick={this.onProductClick}/>
                );
              })}
            </ul>
            <Image className="col-xs-6 col-xs-offset-3 margin-bottom-md margin-top-md no-padding" src={activity.shareBtn} onClick={this.onShareBtnClick}/>
          </div>
      </div>
    );
  }
}
