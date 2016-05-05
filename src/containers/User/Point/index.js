import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';
import * as actionCreators from 'actions/user/point';
import { Toast } from 'components/Toast';

import './index.scss';

@connect(
  state => ({
    point: state.point.data,
    isLoading: state.point.isLoading,
    error: state.point.error,
    success: state.point.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class Point extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    point: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchPoint: React.PropTypes.func,
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
  }

  componentWillReceiveProps(nextProps) {

  }

  onInstructionsClick = (e) => {

  }

  render() {
      return (
          <div>
        <Header title="我的积分" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} rightText={'使用说明'} onRightBtnClick={this.onInstructionsClick} />
        <div className="has-header content point-container">
          <div className="row my-point padding-bottom-xxs">
            <p className="text-center no-margin">25</p>
            <span className="col-xs-12 text-center">我的积分</span>
          </div>
          <ul className="point-list">
            <li className="row no-margin bottom-border">
              <div className="col-xs-12 padding-top-xxs">
                <p className="col-xs-12">2015-11-03 16:45:45</p>
                <p className="col-xs-9">购物订单完成建立积分</p>
                <span className="col-xs-3">+24分</span>
                <p className="col-xs-12">订单号 9862453</p>
              </div>
            </li>
            <li className="row no-margin bottom-border">
              <div className="col-xs-12 padding-top-xxs">
                <p className="col-xs-12">2015-11-03 16:45:45</p>
                <p className="col-xs-9">购物订单完成建立积分</p>
                <span className="col-xs-3">+24分</span>
                <p className="col-xs-12">订单号 9862453</p>
              </div>
            </li>
            <li className="row no-margin bottom-border">
              <div className="col-xs-12 padding-top-xxs">
                <p className="col-xs-12">2015-11-03 16:45:45</p>
                <p className="col-xs-9">购物订单完成建立积分</p>
                <span className="col-xs-3">+24分</span>
                <p className="col-xs-12">订单号 9862453</p>
              </div>
            </li>
            <li className="row no-margin bottom-border">
              <div className="col-xs-12 padding-top-xxs">
                <p className="col-xs-12">2015-11-03 16:45:45</p>
                <p className="col-xs-9">购物订单完成建立积分</p>
                <span className="col-xs-3">+24分</span>
                <p className="col-xs-12">订单号 9862453</p>
              </div>
            </li>
            <li className="row no-margin bottom-border">
              <div className="col-xs-12 padding-top-xxs">
                <p className="col-xs-12">2015-11-03 16:45:45</p>
                <p className="col-xs-9">购物订单完成建立积分</p>
                <span className="col-xs-3">+24分</span>
                <p className="col-xs-12">订单号 9862453</p>
              </div>
            </li>
            <li className="row no-margin bottom-border">
              <div className="col-xs-12 padding-top-xxs">
                <p className="col-xs-12">2015-11-03 16:45:45</p>
                <p className="col-xs-9">购物订单完成建立积分</p>
                <span className="col-xs-3">+24分</span>
                <p className="col-xs-12">订单号 9862453</p>
              </div>
            </li>
            <li className="row no-margin bottom-border">
              <div className="col-xs-12 padding-top-xxs">
                <p className="col-xs-12">2015-11-03 16:45:45</p>
                <p className="col-xs-9">购物订单完成建立积分</p>
                <span className="col-xs-3">+24分</span>
                <p className="col-xs-12">订单号 9862453</p>
              </div>
            </li>
          </ul>
          <Footer/>
        </div>
      </div>
    );
  }
}
