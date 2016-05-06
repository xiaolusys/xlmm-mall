import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
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

  componentWillMount() {
    this.props.fetchPoint();
    this.props.fetchPointLogs();
  }

  render() {
    const { point, pointLog } = this.props;
    const logs = pointLog.data.results || [];
    return (
      <div>
        <Header title="我的积分" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="has-header content point-container">
          <div className="row bonus-point padding-bottom-xxs">
            <p className="text-center no-margin font-orange">{point.data.integral_value || 0}</p>
            <span className="col-xs-12 text-center">我的积分</span>
          </div>
          <If condition={!_.isEmpty(logs)}>
            <ul className="point-list">
              {logs.map((log, index) => {
                return (
                  <li key={log.id} className="row no-margin bottom-border">
                    <div className="col-xs-12 padding-top-xxs">
                      <p className="col-xs-12">{log.created}</p>
                      <p className="col-xs-8">{log.order_info.detail}</p>
                      <If condition={log.log_value > 0}>
                        <span className="col-xs-4 font-orange">+{log.log_value}分</span>
                      </If>
                      <If condition={log.log_value < 0}>
                        <span className="col-xs-4">{log.log_value}分</span>
                      </If>
                      <p className="col-xs-12">订单编号 {log.order_info.id}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={_.isEmpty(logs) || pointLog.isLoading}>
            <div className="text-center padding-top-sm">
              <i className="icon-database icon-5x"/>
              <p>您暂时还没有积分纪录哦～</p>
              <p className="font-xs font-grey-light">快去下单赚取积分吧～</p>
              <Link className="col-xs-4 col-xs-offset-4 margin-top-xs margin-bottom-lg button button-energized" to="/">快去抢购</Link>
            </div>
          </If>
          <Footer/>
        </div>
      </div>
    );
  }
}
