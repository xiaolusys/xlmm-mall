import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { DownloadAppBanner } from 'components/DownloadAppBanner';
import { Timer } from 'components/Timer';
import { Carousel } from 'components/Carousel';
import { Image } from 'components/Image';
import { Toast } from 'components/Toast';
import { WechatPopup } from 'components/WechatPopup';
import classnames from 'classnames';
import * as constants from 'constants';
import * as utils from 'utils';
import pingpp from 'vendor/pingpp';
import _ from 'underscore';
import * as plugins from 'plugins';
import * as spellGroupAction from 'actions/order/spellGroup';
import * as wechatSignAction from 'actions/wechat/sign';

import './index.scss';

const actionCreators = _.extend(wechatSignAction, spellGroupAction);

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
    spellGroup: state.spellGroup,
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Progress extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    spellGroup: React.PropTypes.any,
    fetchWechatSign: React.PropTypes.func,
    fetchSpellGroupDetails: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'spell-group-progress',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    popupActive: false,
  }

  componentWillMount() {
    const { sId } = this.props.params;
    this.props.fetchWechatSign();
    this.props.fetchSpellGroupDetails(sId);
  }

  componentWillReceiveProps(nextProps) {
    const { progress, share } = nextProps.spellGroup;
    utils.wechat.config(nextProps.wechatSign);
    utils.wechat.configShareContent({
      success: nextProps.spellGroup.share.success,
      data: {
        title: nextProps.spellGroup.share.data.title,
        desc: nextProps.spellGroup.share.data.active_dec,
        link: nextProps.spellGroup.share.data.share_link,
        imgUrl: nextProps.spellGroup.share.data.share_icon,
      },
    });
    if (progress.isLoading || share.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  onShareBtnClick = (e) => {
    const { spellGroup } = this.props;
    const shareData = {
      share_title: spellGroup.share.data.title,
      share_to: '',
      share_desc: spellGroup.share.data.active_dec,
      share_icon: spellGroup.share.data.share_icon,
      share_type: 'link',
      link: `${window.location.host}${spellGroup.share.data.share_link}`,
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

  onSpellGroupBtnClick = (e) => {
    const fromPage = this.props.location.query.from_page;
    const mmLinkId = this.props.location.query.mm_linkid ? this.props.location.query.mm_linkid : '';
    const teambuyId = this.props.spellGroup.progress.data.id ? this.props.spellGroup.progress.data.id : '';
    const { modelid } = e.currentTarget.dataset;
    const status = Number(this.props.spellGroup.progress.data.status);
    if (fromPage === 'order_commit') {
      this.onShareBtnClick();
      return;
    }
    if (fromPage === 'share' && status === 0) {
      window.location.href = `/mall/product/details/${modelid}?teambuyId=${teambuyId}&mm_linkid=${mmLinkId}`;
      return;
    }
    if (fromPage === 'share' && status !== 0) {
      window.location.href = `/mall/product/details/${modelid}`;
      return;
    }
    if (fromPage === 'order_detail' && status === 0) {
      this.onShareBtnClick();
      return;
    }
    if (fromPage === 'order_detail' && status !== 0) {
      window.location.href = `/mall/product/details/${modelid}`;
      return;
    }
  }

  onCloseBtnClick = (e) => {
    this.setState({ popupActive: false });
  }

  getBtnText() {
    const fromPage = this.props.location.query.from_page;
    const status = Number(this.props.spellGroup.progress.data.status);
    if (fromPage === 'order_commit') {
      return '分享团购';
    }
    if (fromPage === 'share' && status === 0) {
      return '参加团购';
    }
    if (fromPage === 'share' && status !== 0) {
      return '我也要开个团';
    }
    if (fromPage === 'order_detail' && status === 0) {
      return '分享团购';
    }
    if (fromPage === 'order_detail' && status !== 0) {
      return '我也要开个团';
    }
  }

  renderCarousel(images) {
    const windowWidth = utils.dom.windowWidth();
    const carouselHeight = Number((utils.dom.windowHeight() * 0.7).toFixed(0));
    return (
      <Carousel >
      {images.map((image, index) => {
        return (
          <div key={index}>
            <Image style={{ width: windowWidth, height: carouselHeight }} thumbnail={windowWidth} crop={ windowWidth + 'x' + carouselHeight } src={image} />
          </div>
        );
      })}
      </Carousel>
    );
  }

  renderProductInfo(info) {
    return (
      <div>
        <div className="product-info bottom-border bg-white">
          <div className="row no-margin">
            <p className="col-xs-8 no-padding no-wrap product-name">{info.name}</p>
            <p className="col-xs-4 no-padding text-right team-price">{`¥${info.team_price}`}</p>
          </div>
          <div className="row no-margin">
            <p className="col-xs-8 no-padding no-wrap font-xs">{info.desc}</p>
            <p className="col-xs-4 no-padding text-right font-xs">{`独购价${info.agent_price}`}</p>
          </div>
        </div>
      </div>
    );
  }

  renderPresenter(data) {
    let detailLength = 0;
    return (
      <div className="row no-margin presenter-list">
        {data.detail_info.map((item, index) => {
        if (item.customer_id) {
          detailLength = detailLength + 1;
        }
        return (
          <div className="col-xs-2 no-padding" key={index}>
            <Image src={item.customer_thumbnail} />
          </div>
          );
        })}
      </div>
    );
  }

  renderProgressStatus(data) {
    let detailLength = 0;
    return (
      <div className="row no-margin progress-status">
      {data.detail_info.map((item, index) => {
        if (item.customer_id) {
          detailLength = detailLength + 1;
        }
      })}

        <If condition={data.status === 0}>
          <p className="no-margin margin-top-xxxs ">还差<span className="font-xlg left-num">{`${data.limit_person_num - detailLength}`}</span>人拼团成功</p>
        </If>
        <If condition={data.status === 1}>
          <p className="no-margin  font-xlg font-orange">拼团成功</p>
        </If>
        <If condition={data.status === 2}>
          <p className="no-margin font-xlg font-orange">拼团失败</p>
        </If>
      </div>
    );
  }

  renderJoinList(data) {
    return (
      <div className="row no-margin join-list">
        <If condition={data.limit_time && Number(data.status) === 0}>
          <div className="col-xs-12 text-center">
            <p className="countdown">
              <span className="font-grey-light margin-right-xxs">{'剩余时间'}</span>
              <Timer endDateString={data.limit_time} />
            </p>
          </div>
        </If>
        <ul>
        {data.detail_info.reverse().map((item, index) => {
        return (
        <If condition={item.originizer}>
          <li className="row no-margin" key={index}>
            <p className="no-margin col-xs-12 no-padding">{item.join_time ? item.join_time.replace('T', ' ') : ''}</p>
            <div className="col-xs-12 no-padding">
              <div className="col-xs-2 no-padding">
                <Image src={item.customer_thumbnail} />
              </div>
              <p className="no-margin col-xs-10 join-item bg-yellow">
                <span className="col-xs-6 padding-top-xxs no-wrap no-padding">团长 {item.customer_nick}</span>
                <span className="no-padding join-info">发起团购</span>
              </p>
            </div>
          </li>
          </If>
          );
        })}
        </ul>
      </div>
    );
  }

  render() {
    const { prefixCls, spellGroup } = this.props;
    const { progress, share } = spellGroup;
    const fromPage = this.props.location.query.from_page;
    return (
      <div className={`${prefixCls}`}>
        <Header title="小鹿美美拼团" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          <If condition={!_.isEmpty(progress.data) && !_.isEmpty(share.data)}>
            <DownloadAppBanner />
            {this.renderCarousel(progress.data.product_info.head_imgs)}
            {this.renderProductInfo(progress.data.product_info)}
            {this.renderPresenter(progress.data)}
            {this.renderProgressStatus(progress.data)}
            {this.renderJoinList(progress.data)}
            <div className="row no-margin">
              <If condition={fromPage === 'order_commit' || fromPage === 'order_detail' || fromPage === 'share'}>
                <button className="col-xs-10 col-xs-offset-1 margin-top-xs margin-bottom-xs button" data-modelid={progress.data.product_info.model_id} type="button" onClick={this.onSpellGroupBtnClick}>{this.getBtnText()}</button>
              </If>
            </div>
            <WechatPopup active={this.state.popupActive} onCloseBtnClick={this.onCloseBtnClick}/>
          </If>
          <If condition={_.isEmpty(progress.data)}>
            <p className="no-margin padding-top-xs padding-left-xs padding-bottom-xs">暂无团购进度信息</p>
          </If>
        </div>
      </div>
    );
  }
}
