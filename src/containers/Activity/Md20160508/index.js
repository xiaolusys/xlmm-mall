import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/user/coupon';
import _ from 'underscore';
import * as utils from 'utils';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import productsGroups from './products';

import './index.scss';

import banner from './images/banner.png';
import coupon from './images/coupon.png';
import footer from './images/footer.png';
import redpacket from './images/redpacket.png';

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
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Md20160508 extends Component {

  static propTypes = {
    images: React.PropTypes.string,
    couponIds: React.PropTypes.string,
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    fetchCoupon: React.PropTypes.func,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    images: './images/',
    couponIds: '42,43,44',
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
      Toast.show(nextProps.data.res);
    }
  }

  onCouponClick = (e) => {
    this.props.fetchCoupon(this.props.couponIds);
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

  toggleRedpacketOpenedState = (e) => {
    this.setState({ redpacketOpened: !this.state.redpacketOpened });
  }

  render() {
    const { images } = this.props;
    const data = this.props.data || {};
    return (
      <div>
        <Header title="母亲节特惠" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content content-white-bg activity-md">
          <img className="col-md-4 col-md-offset-3 col-xs-12 no-padding" src={banner} />
          <img className="col-md-2 col-md-offset-4 col-xs-10 col-xs-offset-1 no-padding margin-top-sm" src={coupon} onClick={this.onCouponClick} />
          {productsGroups.map((group, index) => {
            return (
              <div key={index} className="margin-top-sm col-md-4 col-md-offset-3 ">
                <img className="col-xs-6 col-xs-offset-3 no-padding margin-top-sm" src={require(`${images}${group.header}`)} />
                <ul>
                {group.products.map((product, i) => {
                  return (
                    <li className="col-xs-6 activity-product" key={i} data-modelid={product.modleId} data-productid={product.productId} onClick={this.onProductClick}>
                      <img src={require(`${images}${product.pic}`)} />
                    </li>
                  );
                })}
                </ul>
              </div>
            );
          })}
          <img className="col-md-2 col-md-offset-4 col-xs-8 col-xs-offset-2 no-padding margin-top-md margin-bottom-sm" src={footer} />
          <If condition={this.state.redpacketOpened}>
            <div className="popup" onClick={this.toggleRedpacketOpenedState}>
              <div className="content">
                <img className="col-xs-12 col-md-3 col-md-offset-4" src={redpacket} />
              </div>
              <div className="popup-overlay"></div>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
