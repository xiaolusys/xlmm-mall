import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Loader } from 'components/Loader';
import * as actionCreators from 'actions/user/coupon';

import './index.scss';

@connect(
  state => ({
    coupon: {
      data: state.coupon.data,
      isLoading: state.coupon.isLoading,
      error: state.coupon.error,
      success: state.coupon.success,
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
    coupon: React.PropTypes.any,
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
    // this.props.fetchUnexpiredCoupons();
    this.props.fetchExpiredCoupons();
  }

  render() {
    const { isLoading, coupon } = this.props;
    const coupons = coupon.data.results;
    return (
      <div>
        <Header title="优惠劵" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="has-header content point-container">
          {isLoading ? <Loader/> : null}
          <If condition={!_.isEmpty(coupons)}>
            <ul className="coupon-list">
              {coupons.map((item, index) => {
                return (
                  <li key={item.id} className="row no-margin bottom-border padding-top-xxs padding-bottom-xxs text-center">
                    <p className="col-xs-6">¥10</p>
                    <span>{item.use_fee_des}</span>
                    <p className="col-xs-12">使用期限 2016-01-10至2016-04-26</p>
                    <p className="col-xs-12">适用范围 {item.pros_desc}</p>
                    <span className="col-xs-12">优惠编码 {item.coupon_no}</span>
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={_.isEmpty(coupons) || coupon.isLoading}>
            <div className="text-center padding-top-sm">
              <i className="icon-coupon-o icon-5x"/>
              <p>您暂时还没有优惠劵哦～</p>
              <p className="font-xs font-grey-light">快去逛逛吧～</p>
              <Link className="col-xs-4 col-xs-offset-4 margin-top-xs margin-bottom-lg button-energized" to="/">快去抢购</Link>
            </div>
          </If>
          <Footer/>
        </div>
      </div>
    );
  }
}
