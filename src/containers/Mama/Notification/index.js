import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import * as constants from 'constants';

import { Image } from 'components/Image';
import { Toast } from 'components/Toast';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import * as actionCreators from 'actions/mama/notification';

import './index.scss';

@connect(
  state => ({
    notification: state.notification,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Notification extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    params: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    notification: React.PropTypes.any,
    fetchNotifications: React.PropTypes.func,
    resetNotifications: React.PropTypes.func,
    readNotification: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    pageIndex: 0,
    pageSize: 20,
    hasMore: true,
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    this.props.fetchNotifications(pageIndex + 1, pageSize);
  }

  componentDidMount() {
    this.props.resetNotifications();
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { pageIndex, pageSize } = this.state;
    const { notification } = nextProps;
    const { fetchNotification, readNotification } = notification;
    if (fetchNotification.success) {
      const count = fetchNotification.data.count;
      const size = fetchNotification.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
    if (fetchNotification.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    if (scrollTop === documentHeight - windowHeight && !this.props.notification.fetchNotification.isLoading && this.state.hasMore) {
      this.props.fetchNotifications(pageIndex + 1, pageSize);
    }
  }

  onNotificationClick = (e) => {
    const { id, to, read } = e.currentTarget.dataset;
    const appUrl = `com.jimei.xlmm://app/v1/webview?is_native=1&url=${to}`;
    if (read === 'false') {
      this.props.readNotification(id);
    }
    if (utils.detector.isAndroid() && typeof window.AndroidBridge !== 'undefined') {
      window.AndroidBridge.jumpToNativeLocation(appUrl);
      return;
    }
    if (utils.detector.isIOS()) {
      plugins.invoke({
        method: 'jumpToNativeLocation',
        data: { target_url: appUrl },
        callback: (resp) => {},
      });
      return;
    }
    // window.location.href = `/mama/university/course/detail?link=${encodeURIComponent(to)}`;
    e.preventDefault();
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderNotifications = (data) => {
    return (
      data.map((item, index) => {
        return (
          <div key={index} className="row no-margin notification-item" data-id={item.id} data-to={item.content_link} data-read={item.read} onClick={this.onNotificationClick}>
            <div className="col-xs-3" data-modelid={item.id} onClick={this.onProductClick}>
              <LazyLoad throttle={200}>
                <Image className={''} src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/mama/v1/notification.png'} thumbnail={200}/>
              </LazyLoad>
            </div>
            <div className="col-xs-9 notification-info">
              <p className="no-margin margin-top-xxs no-wrap">{item.title}</p>
              <p className="no-margin margin-top-xxs">
                <span className="pull-left font-orange">{item.read === true ? '已读' : '未读'}</span>
                <span className="pull-right font-grey-light font-xs time-created">{`日期:${item.created.replace('T', ' ')}`}</span>
              </p>
            </div>
          </div>
        );
      })
    );
  }

  render() {
    const { activeTab, sticky, favoriteStatus } = this.state;
    const hasHeader = !utils.detector.isApp();
    const { fetchNotification } = this.props.notification;
    const data = fetchNotification.data.results || [];
    const unReadCount = fetchNotification.data.count || 0;
    return (
      <div>
        <Header title="通知" leftIcon="icon-angle-left" rightText={`${unReadCount}条未读`} onLeftBtnClick={this.context.router.goBack} hide={!hasHeader} />
          <div className="content favorite-container">
            <If condition={!_.isEmpty(data)}>
              {this.renderNotifications(data)}
            </If>
          </div>
      </div>
    );
  }
}
