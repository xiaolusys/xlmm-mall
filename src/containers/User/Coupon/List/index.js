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
    hasMore: true,
    pageIndex: 0,
    pageSize: 10,
    activeTab: 0,
    sticky: false,
  }

  componentWillMount() {
    const { couponStatus } = constants;
    this.props.fetchCouponsByStatus(couponStatus.available);
    this.props.fetchCouponsByStatus(couponStatus.used);
    this.props.fetchCouponsByStatus(couponStatus.expired);
    this.props.fetchCouponsByStatus(couponStatus.available, 8);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { coupons, coupon, verifyCoupon } = nextProps;
    const { query } = this.props.location;
    const state = this.state;
    let count = 0;
    let size = 0;
    let data = null;
    const { couponStatus } = constants;
    const { available, used, unavailable, expired, negotiable } = nextProps.coupons;

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

    if (this.state.activeTab === couponStatus.available) {
      if (available.success) {
        data = available.data;
      }
    } else if (this.state.activeTab === couponStatus.negotiable) {
      if (negotiable.success) {
        data = negotiable.data;
      }
    } else if (this.state.activeTab === couponStatus.used) {
      if (used.success) {
        data = used.data;
      }
    } else if (this.state.activeTab === couponStatus.expired) {
      if (expired.success) {
        data = expired.data;
      }
    }

    if (data) {
      count = data.count;
      size = data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.coupon-tabs');
    const { pageSize, pageIndex, activeTab } = this.state;
    const { couponStatus } = constants;
    const { available, used, unavailable, expired, negotiable } = this.props.coupons;
    let page = 1;
    if (scrollTop === documentHeight - windowHeight) {
      if (this.state.activeTab === couponStatus.available) {
        if (available.success && available.data && available.data.next) {
          page = this.getPage(available.data.next);
          this.props.fetchCouponsByStatus(couponStatus.available, null, page);
        }
      } else if (this.state.activeTab === couponStatus.negotiable) {
        if (negotiable.success && negotiable.data && negotiable.data.next) {
          page = this.getPage(negotiable.data.next);
          this.props.fetchCouponsByStatus(couponStatus.available, 8, page);
        }
      } else if (this.state.activeTab === couponStatus.used) {
        if (used.success && used.data && used.data.next) {
          page = this.getPage(used.data.next);
          this.props.fetchCouponsByStatus(couponStatus.used, null, page);
        }
      } else if (this.state.activeTab === couponStatus.expired) {
        if (expired.success && expired.data && expired.data.next) {
          page = this.getPage(expired.data.next);
          this.props.fetchCouponsByStatus(couponStatus.expired, null, page);
        }
      }
    }

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
      pageIndex: 0,
    });
    e.preventDefault();
  }

  getCoupons(type) {
    const { available, used, unavailable, expired, negotiable } = this.props.coupons;
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
      case 5:
        coupons = negotiable;
        break;
      default:
    }
    return coupons;
  }

  getPage(nextUrl) {
    let page = 1;
    const parts = nextUrl.split(`&`);
    if (parts.length > 0) {
      for (let i = parts.length - 1; i >= 0; i--) {
         if (parts[i].indexOf('page') >= 0) {
            page = Number(parts[i].substring(parts[i].indexOf('=') + 1));
         }
      }
    }
    return page;
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { query } = this.props.location;
    const { available, used, unavailable, expired, negotiable } = this.props.coupons;
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
              <li id="available" className={'col-xs-3' + (activeTab === couponStatus.available ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>未使用({available.data && available.data.count ? available.data.count : 0})</div>
              </li>
              <li id="negotiable" className={'col-xs-3' + (activeTab === couponStatus.negotiable ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>精品券({negotiable.data && negotiable.data.count})</div>
              </li>
              <li id="used" className={'col-xs-3' + (activeTab === couponStatus.used ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>已使用({used.data && used.data.count})</div>
              </li>
              <li id="expired" className={'col-xs-3' + (activeTab === couponStatus.expired ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>已过期({expired.data && expired.data.count})</div>
              </li>
            </ul>
          </div>
          <If condition={!_.isEmpty(coupons.data && coupons.data.results)}>
            <ul className="coupon-list">
              {coupons.data.results.map((item, index) => {
                return (
                  <Coupon status={item.status} couponItem={item} key={index} data-status={item.status} data-id={item.id} onClick={this.onCouponItemClick}/>
                );
              })}
            </ul>
          </If>
          <If condition={_.isEmpty(coupons.data && coupons.data.results) || available.isLoading || used.isLoading || unavailable.isLoading || expired.isLoading || negotiable.isLoading}>
            <div className="text-center coupon-list-empty">
              <i className="icon-coupon-o icon-6x font-grey"/>
              <p>您暂时还没有优惠劵哦～</p>
              <p className="font-xs font-grey-light">快去逛逛吧～</p>
              <Link className="col-xs-4 col-xs-offset-4 margin-bottom-lg button button-energized" to="/">快去抢购</Link>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
