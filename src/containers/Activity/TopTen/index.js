import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as couponAction from 'actions/user/coupon';
import * as promotionAction from 'actions/activity/promotion';
import _ from 'underscore';
import * as utils from 'utils';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import activity from './activity';

import './index.scss';

const actionCreators = _.extend(promotionAction, couponAction);
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
    coupon: {
      data: state.coupon.data,
      isLoading: state.coupon.isLoading,
      success: state.coupon.success,
      error: state.coupon.error,
    },
    promotion: {
      data: state.promotion.data,
      isLoading: state.promotion.isLoading,
      success: state.promotion.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class TopTen extends Component {

  static propTypes = {
    coupon: React.PropTypes.any,
    promotion: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    location: React.PropTypes.object,
    fetchCoupon: React.PropTypes.func,
    resetCoupon: React.PropTypes.func,
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
    redpacketOpened: false,
    remaining: {
      totals: '00',
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    },
  }


  componentWillMount() {
    this.props.fetchPromotion(activity.activityId);
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coupon.success) {
      if (nextProps.coupon.data.code === 0) {
        this.toggleRedpacketOpenedState();
      }
      Toast.show(nextProps.coupon.data.res);
    }
    if (nextProps.coupon.error) {
      this.props.resetCoupon();
      this.context.router.replace(`/user/login?next=${this.props.location.pathname}`);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onCouponClick = (e) => {
    this.props.fetchCoupon(activity.couponIds);
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
      webUrl = '/tongkuan.html?id=' + modelId;
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

  toggleRedpacketOpenedState = (e) => {
    this.setState({ redpacketOpened: !this.state.redpacketOpened });
  }

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
    const { days, hours, minutes, seconds } = this.state.remaining;
    return (
      <div>
        <Header title="Top10精选" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content content-white-bg clearfix activity-top10">
            <img className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={activity.banner} />
            <img className="col-md-6 col-md-offset-3 col-xs-12" src={activity.coupon} onClick={this.onCouponClick}/>
            <div className="col-md-6 col-md-offset-3 col-xs-12 mragin-top-sm mragin-bottom-xs">
              <img className="col-xs-5 no-padding" src={activity.countdownText} />
              <p className="col-xs-7 no-padding countdown">
                <span className="js-dayss">{days}</span> :
                <span className="js-hours">{hours}</span> :
                <span className="js-minutes">{minutes}</span> :
                <span className="js-seconds">{seconds}</span>
              </p>
            </div>
            <ul className="product-list">
              {activity.products.map((product, index) => {
                return (
                  <li key={index} data-modelid={product.modelId} data-productid={product.productId} onClick={this.onProductClick}>
                    <img className="col-xs-12 col-md-6 col-md-offset-3" src={product.pic} />
                  </li>
                );
              })}
            </ul>
            <img className="col-md-6 col-md-offset-3 col-xs-12 no-padding mragin-top-xs mragin-bottom-xs" src={activity.rule} />
            <img className="col-md-6 col-md-offset-3 col-xs-12 no-padding" src={activity.footer} />
            <If condition={this.state.redpacketOpened}>
              <div className="popup" onClick={this.toggleRedpacketOpenedState}>
                <div className="content">
                  <img className="col-xs-12 col-md-3 col-md-offset-4" src={activity.redpacket} />
                  <img className="js-share col-md-4 col-md-offset-4 col-xs-8 col-xs-offset-2 mragin-top-xs" src={activity.shareBtn} onClick={this.onShareBtnClick} />
                </div>
                <div className="popup-overlay"></div>
              </div>
            </If>
          </div>
      </div>
    );
  }
}
