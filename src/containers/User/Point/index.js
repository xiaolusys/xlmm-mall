import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import * as pointAction from 'actions/user/point';
import * as pointLogAction from 'actions/user/pointLog';

import './index.scss';
const actionCreators = _.extend(pointAction, pointLogAction);

@connect(
  state => ({
    point: {
      data: state.point.data,
      isLoading: state.point.isLoading,
      error: state.point.error,
      success: state.point.success,
    },
    pointLog: {
      data: state.pointLog.data,
      isLoading: state.pointLog.isLoading,
      error: state.pointLog.error,
      success: state.pointLog.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class Point extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    point: React.PropTypes.any,
    pointLog: React.PropTypes.any,
    fetchPoint: React.PropTypes.func,
    fetchPointLogs: React.PropTypes.func,
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
    this.props.fetchPoint();
    this.props.fetchPointLogs(pageIndex + 1, pageSize);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const pointLog = nextProps.pointLog;
    let count = 0;
    let size = 0;
    if (pointLog.success && pointLog.data && pointLog.data.count) {
      count = pointLog.data.count;
      size = pointLog.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
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
    if (scrollTop === documentHeight - windowHeight && !this.props.pointLog.isLoading && this.state.hasMore) {
      this.props.fetchPointLogs(pageIndex + 1, pageSize);
    }
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { point, pointLog } = this.props;
    const logs = pointLog.data.results || [];
    return (
      <div>
        <Header title="我的积分" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content point-container">
          {point.isLoading || pointLog.isLoading ? <Loader/> : null}
          <If condition={point.data && point.data.integral_value}>
            <div className="row bonus-point padding-bottom-xxs">
              <p className="col-xs-12 no-margin margin-top-sm text-center no-margin font-orange bonus-point-value">{point.data.integral_value || 0}</p>
              <p className="col-xs-12 no-margin margin-bottom-sm text-center font-sm">我的积分</p>
            </div>
          </If>
          <If condition={!_.isEmpty(logs)}>
            <ul className="point-list">
              {logs.map((log, index) => {
                return (
                  <li key={log.id} className="row no-margin padding-top-xs padding-bottom-xs bottom-border">
                    <div className="row no-margin">
                      <p className="col-xs-12 no-margin font-xs font-grey-light">{log.created.replace(/T/, ' ')}</p>
                      <If condition={log.log_value > 0}>
                        <p className="col-xs-12 no-margin">
                          <span className="col-xs-8 no-padding">购物订单完成奖励积分</span>
                          <span className="col-xs-4 no-padding text-right font-orange">+{log.log_value}分</span>
                        </p>
                      </If>
                      <If condition={log.log_value < 0}>
                        <p className="col-xs-12 no-margin">
                          <span className="col-xs-8 no-padding">实物抵换</span>
                          <span className="col-xs-4 no-padding font-orange">{log.log_value}分</span>
                        </p>
                      </If>
                      <p className="col-xs-12 no-margin">
                        <span>订单编号</span>
                        <If condition={!_.isEmpty(log.order_info)}>
                          <span className="padding-left-xxs">{log.order_info.order_id}</span>
                        </If>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={_.isEmpty(logs) && !(point.data && point.data.integral_value) || pointLog.isLoading}>
            <div className="text-center point-list-empty">
              <i className="icon-database icon-5x"/>
              <p>您暂时还没有积分纪录哦～</p>
              <p className="font-xs font-grey-light">快去下单赚取积分吧～</p>
              <Link className="col-xs-4 col-xs-offset-4 margin-top-xs margin-bottom-lg button button-energized" to="/">快去抢购</Link>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
