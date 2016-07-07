import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Loader } from 'components/Loader';
import { Coupon } from 'components/Coupon';
import { Toast } from 'components/Toast';
import * as couponsAction from 'actions/user/coupons';
import * as couponAction from 'actions/user/coupon';
import * as verifyCouponAction from 'actions/user/verifyCoupon';
import * as constants from 'constants';

import './index.scss';

const actionCreators = _.extend(couponAction, couponsAction, verifyCouponAction);
const couponTypes = {
  0: '可用优惠劵',
  1: '已用优惠劵',
  2: '不可用优惠劵',
  3: '过期优惠劵',
};

@connect(
  state => ({
    coupon: state.coupon,
    coupons: state.coupons,
    verifyCoupon: state.verifyCoupon,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    coupon: React.PropTypes.object,
    coupons: React.PropTypes.object,
    verifyCoupon: React.PropTypes.object,
    fetchCouponsByStatus: React.PropTypes.func,
    fetchVerifyCoupon: React.PropTypes.func,
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

  componentWillReceiveProps(nextProps) {
    const { coupons, coupon, verifyCoupon } = nextProps;
    const { query } = this.props.location;
    const state = this.state;
    if (verifyCoupon.success && verifyCoupon.data) {
      if (verifyCoupon.data.coupon_message) {
        Toast.show(verifyCoupon.data.coupon_message);
      } else if (state.couponid) {
        this.context.router.replace(query.next.indexOf('?') > 0 ? `${query.next}&couponId=${state.couponid}` : `${query.next}?couponId=${state.couponid}`);
      }
    }
    if (coupon.isLoading || coupons.isLoading || verifyCoupon.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  onCouponItemClick = (e) => {
    const { query } = this.props.location;
    const { status, id } = e.currentTarget.dataset;
    if (!query.next || Number(status) !== constants.couponStatus.available) {
      return;
    }
    this.setState({ couponid: id });
    this.props.fetchVerifyCoupon(query.cartIds, id);
    e.preventDefault();
  }

  onBtnClick = (e) => {
    const { query } = this.props.location;
    this.context.router.replace(query.next);
    e.preventDefault();
  }

  render() {
    const { query } = this.props.location;
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
          <If condition={query.next}>
            <div className="row no-margin">
              <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.onBtnClick}> 取消</button>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
