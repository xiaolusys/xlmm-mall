import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Loader } from 'components/Loader';
import { Coupon } from 'components/Coupon';
import * as actionCreators from 'actions/user/coupons';
import * as constants from 'constants';

import './index.scss';
const couponTypes = {
  0: '可用优惠劵',
  1: '已用优惠劵',
  2: '不可用优惠劵',
  3: '过期优惠劵',
};

@connect(
  state => ({
    coupons: state.coupons,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    coupons: React.PropTypes.any,
    fetchCouponsByStatus: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {}

  componentWillMount() {
    const { couponStatus } = constants;
    this.props.fetchCouponsByStatus(couponStatus.available);
    this.props.fetchCouponsByStatus(couponStatus.used);
    this.props.fetchCouponsByStatus(couponStatus.unavailable);
    this.props.fetchCouponsByStatus(couponStatus.expired);
  }

  onCouponItemClick = (e) => {
    const { query } = this.props.location;
    const { status, id } = e.currentTarget.dataset;
    if (!query.next || Number(status) !== constants.couponStatus.available) {
      return;
    }
    this.context.router.replace(query.next.indexOf('?') > 0 ? `${query.next}&couponId=${id}` : `${query.next}?couponId=${id}`);
    e.preventDefault();
  }

  render() {
    const { available, used, unavailable, expired } = this.props.coupons;
    return (
      <div>
        <Header title="优惠劵" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content coupons-container">
        {_(this.props.coupons).map((coupon) => {
            return (
              <div>
                <If condition={coupon.isLoading}>
                  <Loader/>
                </If>
                <If condition={!_.isEmpty(coupon.data)}>
                  <p>{couponTypes[coupon.data.status]}</p>
                  <ul className="coupon-list">
                    {coupon.data.map((item, index) => {
                      return (
                        <Coupon status={item.status} couponItem={item} key={index} data-status={item.status} data-id={item.id} onClick={this.onCouponItemClick}/>
                      );
                    })}
                  </ul>
                </If>
              </div>
            );
          })}
          <If condition={_.isEmpty(available.data) && _.isEmpty(used.data) && _.isEmpty(unavailable.data) && _.isEmpty(expired.data) || available.isLoading || used.isLoading || unavailable.isLoading || expired.isLoading}>
            <div className="text-center padding-top-sm">
              <i className="icon-coupon-o icon-5x"/>
              <p>您暂时还没有优惠劵哦～</p>
              <p className="font-xs font-grey-light">快去逛逛吧～</p>
              <Link className="col-xs-4 col-xs-offset-4 margin-top-xs margin-bottom-lg button button-energized" to="/">快去抢购</Link>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
