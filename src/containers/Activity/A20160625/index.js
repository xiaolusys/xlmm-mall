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
export default class A20160625 extends Component {

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
    this.props.receiveCoupon(activity.couponIds);
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

  toggleRedpacketOpenedState = (e) => {
    this.setState({ redpacketOpened: !this.state.redpacketOpened });
  }

  render() {
    return (
      <div>
        <Header title="夏季主角—本周Top榜单10强" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} hide={utils.detector.isApp()} />
          <div className="content content-white-bg clearfix activity-top10">
            <Image className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={activity.banner} />
            <Image className="col-xs-12 no-padding" src={activity.coupon} onClick={this.onCouponClick} />
            <ul className="product-list">
              {activity.products.map((product, index) => {
                return (
                  <li className="col-xs-12 col-md-6 col-md-offset-3" key={index} data-modelid={product.modelId} data-productid={product.productId} onClick={this.onProductClick}>
                    <Image src={product.pic} />
                  </li>
                );
              })}
            </ul>
            <Image className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={activity.footer} />
          </div>
          <If condition={this.state.redpacketOpened}>
          <div className="activity-popup">
            <div className="popup-content col-md-4 col-md-offset-4 no-padding">
              <img className="col-xs-12" src={activity.redpacket} />
              <img className="col-xs-12" src={activity.shareBtn} onClick={this.onShareBtnClick}/>
              <img className="col-xs-2 col-xs-offset-5 margin-top-xs" src={activity.closeBtn} onClick={this.toggleRedpacketOpenedState} />
            </div>
            <div className="popup-overlay"></div>
          </div>
        </If>
      </div>
    );
  }
}
