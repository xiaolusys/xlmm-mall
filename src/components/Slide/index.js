import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import { If } from 'jsx-control-statements';
import * as actionCreators from 'actions/user/profile';

import './index.scss';

@connect(
  state => ({
    profile: state.profile.data,
    isLoading: state.profile.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class Slide extends Component {
  static propTypes = {
    profile: React.PropTypes.object,
    fetchProfile: React.PropTypes.func,
  }

  static defaultProps = {

  }

  constructor(props, context) {
    super(props);
  }

  state = {

  }

  componentWillMount() {
    this.props.fetchProfile();
  }

  render() {
    const { profile } = this.props;
    return (
      <nav className="slide-menu">
        <div className="row no-margin">
          <div className="col-xs-6 col-xs-offset-3 text-center">
            <a href="/#/user/profile">
            <div className="avatar">
              <If condition={profile.thumbnail} >
                <img src={profile.thumbnail} />
              </If>
              <If condition={!profile.thumbnail} >
                <i className="icon-avatar icon-xiaolu icon-grey icon-3x"></i>
              </If>
            </div>
            </a>
            <p className="text-center">{profile.nick}</p>
          </div>
        </div>
        <div className="row no-margin account-summary bottom-border-black text-center">
          <div className="col-xs-4">
            <p>{profile.user_budget ? profile.user_budget.budget_cash : 0}</p>
            <p>
              <i className="icon-wallet"></i>
              <span>钱包(元)</span>
            </p>
          </div>
          <div className="col-xs-4">
            <p>{profile.score || 0}</p>
            <p>
              <i className="icon-database"></i>
              <span>积分</span>
            </p>
          </div>
          <div className="col-xs-4">
            <p>{profile.coupon_num || 0}</p>
            <p>
              <i className="icon-coupon-o"></i>
              <span>优惠券</span>
            </p>
          </div>
        </div>
        <ul>
          <li>
            <a>
              <i className="icon-order-square icon-gold"></i>
              <span>待支付</span>
              <If condition={profile.waitpay_num}>
                <span className="badge gold pull-right">{profile.waitpay_num}</span>
              </If>
            </a>
          </li>
          <li>
            <a>
              <i className="icon-truck icon-gold"></i>
              <span>待收货</span>
              <If condition={profile.waitgoods_num}>
                <span className="badge gold pull-right">{profile.waitgoods_num}</span>
              </If>
            </a>
          </li>
          <li>
            <a>
              <i className="icon-cny icon-gold"></i>
              <span>退换货</span>
              <If condition={profile.refunds_num}>
                <span className="badge gold pull-right">{profile.refunds_num}</span>
              </If>
            </a>
          </li>
          <li className="bottom-border-black">
            <a>
              <i className="icon-order icon-gold"></i>
              <span>全部订单</span>
            </a>
          </li>
          <li>
            <a>
              <i className="icon-mail-open icon-gold"></i>
              <span>投诉建议</span>
            </a>
          </li>
          <li>
            <a href="/#/faq">
              <i className="icon-faq icon-gold"></i>
              <span>常见问题</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
