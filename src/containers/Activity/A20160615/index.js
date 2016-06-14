import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/activity/promotion';
import _ from 'underscore';
import * as utils from 'utils';
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
    promotion: {
      data: state.promotion.data,
      isLoading: state.promotion.isLoading,
      success: state.promotion.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class A20160615 extends Component {

  static propTypes = {
    promotion: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    location: React.PropTypes.object,
    fetchPromotion: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

  }

  componentWillMount() {
    this.props.fetchPromotion(activity.activityId);
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onProductClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    const modelId = Number(dataSet.modelid);
    const productId = Number(dataSet.productid);
    let webUrl = '';
    let appUrl = '';
    if (modelId === 0 && productId === 0) {
      return;
    }
    if (modelId) {
      webUrl = '/mall/product/details/' + modelId;
      appUrl = 'com.jimei.xlmm://app/v1/products/modelist?model_id=' + modelId;
    }
    if (productId) {
      webUrl = '/pages/shangpinxq.html?id=' + productId;
      appUrl = 'com.jimei.xlmm://app/v1/products?product_id=' + productId;
    }
    if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
      window.AndroidBridge.jumpToNativeLocation(appUrl);
    } else if (utils.detector.isIOS() && !utils.detector.isWechat()) {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('jumpToNativeLocation', {
          target_url: appUrl,
        }, function(response) {});
      });
    } else {
      window.location.href = webUrl;
    }
  }

  onShareBtnClick = (e) => {
    if (utils.detector.isIOS() && !utils.detector.isWechat()) {
      setupWebViewJavascriptBridge(function(bridge) {
        const data = {
          share_to: '',
          active_id: activity.activityId,
        };
        bridge.callHandler('callNativeShareFunc', data, function(response) {});
      });
    } else if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
      const data = {
        share_to: '',
        active_id: activity.activityId,
      };
      window.AndroidBridge.callNativeShareFunc(data.share_to, data.active_id);
    }
  };

  tick = () => {
    const { promotion } = this.props;
    const endDateString = promotion.data.end_time || new Date();
    const remaining = utils.timer.getTimeRemaining(endDateString);
    if (remaining.totals > 0) {
      this.setState({ remaining: remaining });
    } else {
      clearInterval(this.interval);
    }
  }

  render() {
    return (
      <div>
        <Header title="聚拢无钢圈文胸专场" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content content-white-bg clearfix activity-top10">
            <Image className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={activity.banner} />
            <Image className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={activity.shareBtn} onClick={this.onShareBtnClick} />
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
      </div>
    );
  }
}
