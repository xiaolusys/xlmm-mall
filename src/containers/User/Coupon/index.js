import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Loader } from 'components/Loader';
import * as unexpiredCouponAction from 'actions/user/unexpiredCoupon';
import * as expiredCouponAction from 'actions/user/expiredCoupon';

import './index.scss';

const actionCreators = _.extend(unexpiredCouponAction, expiredCouponAction);

@connect(
  state => ({
    unexpiredCoupon: {
      data: state.unexpiredCoupon.data,
      isLoading: state.unexpiredCoupon.isLoading,
      error: state.unexpiredCoupon.error,
      success: state.unexpiredCoupon.success,
    },
    expiredCoupon: {
      data: state.expiredCoupon.data,
      isLoading: state.expiredCoupon.isLoading,
      error: state.expiredCoupon.error,
      success: state.expiredCoupon.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class Coupon extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    expiredCoupon: React.PropTypes.any,
    unexpiredCoupon: React.PropTypes.any,
    fetchUnexpiredCoupons: React.PropTypes.func,
    fetchExpiredCoupons: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchUnexpiredCoupons();
    this.props.fetchExpiredCoupons();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success && nextProps.unexpiredCoupon.success) {
      this.setState('unexpiredCoupon', nextProps.unexpiredCoupon);
    }
    if (nextProps.success && nextProps.expiredCoupon.success) {
      this.setState('expiredCoupon', nextProps.expiredCoupon);
    }
  }

  render() {
    const { isLoading, unexpiredCoupon, expiredCoupon } = this.props;
    let coupons = [];
    const unexpiredCoupons = unexpiredCoupon.data.results;
    const expiredCoupons = expiredCoupon.data.results;
    if (_.isArray(unexpiredCoupons) && _.isArray(expiredCoupons)) {
      coupons = _.union(unexpiredCoupons, expiredCoupons);
    }
    return (
      <div>
        <Header title="优惠劵" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="has-header content point-container">
          {isLoading ? <Loader/> : null}
          <If condition={!_.isEmpty(coupons)}>
            <ul className="coupon-list">
              {coupons.map((item, index) => {
                return (
                  <li key={item.id} className="row bottom-border padding-top-xxs padding-bottom-xxs text-left font-xs font-grey-light col-xs-offset-1">
                    <p className="col-xs-3 coupon_value">¥10</p>
                    <span className="col-xs-5 coupon-use-fee-des">{item.use_fee_des}</span>
                    <If condition={item.status === 0}>
                      <span className="coupon-status">未使用</span>
                    </If>
                    <If condition={item.status === 1}>
                      <span className="coupon-status">已使用</span>
                    </If>
                    <If condition={item.status === 2}>
                      <span className="coupon-status">已过期</span>
                    </If>
                    <p className="col-xs-10">使用期限 {item.created.substring(0, 10)} 至 {item.deadline.substring(0, 10)}</p>
                    <p className="col-xs-10">适用范围 {item.pros_desc}</p>
                    <span className="col-xs-10">优惠编码 {item.coupon_no}</span>
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={_.isEmpty(coupons) || unexpiredCoupon.isLoading || expiredCoupon.isLoading}>
            <div className="text-center padding-top-sm">
              <i className="icon-coupon-o icon-5x"/>
              <p>您暂时还没有优惠劵哦～</p>
              <p className="font-xs font-grey-light">快去逛逛吧～</p>
              <Link className="col-xs-4 col-xs-offset-4 margin-top-xs margin-bottom-lg button button-energized" to="/">快去抢购</Link>
            </div>
          </If>
          <Footer/>
        </div>
      </div>
    );
  }
}
