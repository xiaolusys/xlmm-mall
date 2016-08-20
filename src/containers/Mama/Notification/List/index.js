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
export default class List extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    params: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    notification: React.PropTypes.any,
    fetchNotifications: React.PropTypes.func,
    resetNotifications: React.PropTypes.func,
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
    this.props.fetchNotifications(pageIndex + 1, pageSize, (new Date()).valueOf());
  }

  componentDidMount() {
    this.props.resetNotifications();
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { pageIndex, pageSize } = this.state;
    const { fetchNotification } = nextProps.notification;
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
    const { pageSize, pageIndex } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    if (scrollTop === documentHeight - windowHeight && !this.props.notification.fetchNotification.isLoading && this.state.hasMore) {
      this.props.fetchNotifications(pageIndex + 1, pageSize, (new Date()).valueOf());
    }
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
          <div key={index} className="row no-margin notification-item">
            <div className="col-xs-2">
              <LazyLoad throttle={200}>
                <Image className={''} src={'http://7xogkj.com1.z0.glb.clouddn.com/mall/mama/v1/notification.png'} thumbnail={200}/>
              </LazyLoad>
            </div>
            <div className="col-xs-10 notification-info">
              <p className="no-margin no-wrap">{item.title}</p>
              <p className="no-margin">
                <span className="pull-left font-grey-light font-xs">{`日期:${item.created.replace('T', ' ')}`}</span>
              </p>
            </div>
            <div className="row no-margin content-white-bg">
              <div className="col-xs-2"></div>
              <p className="col-xs-10 no-margin margin-top-xxs word-break">{item.content}</p>
            </div>
          </div>
        );
      })
    );
  }

  render() {
    const { fetchNotification } = this.props.notification;
    const data = fetchNotification.data.results || [];
    return (
      <div>
        <Header title="通知" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content favorite-container">
            <If condition={!_.isEmpty(data)}>
              {this.renderNotifications(data)}
            </If>
          </div>
      </div>
    );
  }
}
