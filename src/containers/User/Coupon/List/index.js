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

  state = {
    activeTab: 0,
    sticky: false,
  }

  componentWillMount() {
    const { couponStatus } = constants;
    this.props.fetchCouponsByStatus(couponStatus.available);
    this.props.fetchCouponsByStatus(couponStatus.used);
    this.props.fetchCouponsByStatus(couponStatus.expired);
  }

  componentDidMount() {
    this.addScrollListener();
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

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const tabsOffsetTop = utils.dom.offsetTop('.coupon-tabs');
    if (scrollTop > tabsOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
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

  onTabItemClick = (e) => {
    const { couponStatus } = constants;
    const { id } = e.currentTarget;
    this.setState({
      activeTab: couponStatus[id],
    });
    e.preventDefault();
  }

  getCoupons(type) {
    const { available, used, unavailable, expired } = this.props.coupons;
    const { activeTab } = this.state;
    let coupons = [];
    switch (activeTab) {
      case 0:
        coupons = available;
        break;
      case 1:
        coupons = used;
        break;
      case 3:
        coupons = expired;
        break;
      default:
    }
    return coupons;
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { query } = this.props.location;
    const { available, used, unavailable, expired } = this.props.coupons;
    const { sticky, activeTab } = this.state;
    const hasHeader = !utils.detector.isApp();
    const { couponStatus } = constants;
    const coupons = this.getCoupons(activeTab);
    return (
      <div>
        <Header title="优惠劵" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content coupons-container">
        <div className={'coupon-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
          <ul className="row no-margin">
            <li id="available" className={'col-xs-4' + (activeTab === couponStatus.available ? ' active' : '')} onClick={this.onTabItemClick}>
              <div>未使用({available.data && available.data.coupons && available.data.coupons.length})</div>
            </li>
            <li id="used" className={'col-xs-4' + (activeTab === couponStatus.used ? ' active' : '')} onClick={this.onTabItemClick}>
              <div>已使用({used.data && used.data.coupons && used.data.coupons.length})</div>
            </li>
            <li id="expired" className={'col-xs-4' + (activeTab === couponStatus.expired ? ' active' : '')} onClick={this.onTabItemClick}>
              <div>已过期({expired.data && expired.data.coupons && expired.data.coupons.length})</div>
            </li>
          </ul>
        </div>
        <If condition={!_.isEmpty(coupons.data && coupons.data.coupons)}>
          <ul className="coupon-list">
            {coupons.data.coupons.map((item, index) => {
              return (
                <Coupon status={item.status} couponItem={item} key={index} data-status={item.status} data-id={item.id} onClick={this.onCouponItemClick}/>
              );
            })}
          </ul>
        </If>
          <If condition={_.isEmpty(coupons.data && coupons.data.coupons) || available.isLoading || used.isLoading || unavailable.isLoading || expired.isLoading}>
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
