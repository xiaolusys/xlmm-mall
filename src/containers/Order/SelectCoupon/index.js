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
import * as selectCouponAction from 'actions/user/selectCoupon';
import * as verifyCouponAction from 'actions/user/verifyCoupon';
import * as constants from 'constants';

import './index.scss';

const actionCreators = _.extend(selectCouponAction, verifyCouponAction);

@connect(
  state => ({
    selectCoupon: state.selectCoupon,
    verifyCoupon: state.verifyCoupon,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    selectCoupon: React.PropTypes.object,
    verifyCoupon: React.PropTypes.object,
    fetchCouponsByCartid: React.PropTypes.func,
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
    const { query } = this.props.location;
    this.props.fetchCouponsByCartid(query.cartIds);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { selectCoupon, verifyCoupon } = nextProps;
    const { query } = this.props.location;
    const state = this.state;
    if (verifyCoupon.success && verifyCoupon.data) {
      if (verifyCoupon.data.coupon_message) {
        Toast.show(verifyCoupon.data.coupon_message);
      } else if (state.couponids) {
        this.searchSameCoupons();
        let ids = '';
        for (let i = 0; i < state.couponids.length; i++) {
          if (i + 1 === state.couponids.length) {
            ids += this.state.couponids[i];
          } else {
            ids += this.state.couponids[i] + '/';
          }
        }
        this.context.router.replace(query.next.indexOf('?') > 0 ? `${query.next}&couponId=${ids}` : `${query.next}?couponId=${ids}`);
      }
    } else if (verifyCoupon.error) {
      Toast.show(verifyCoupon.data.detail);
    }

    if (selectCoupon.isLoading || verifyCoupon.isLoading) {
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
    const { status, id, type } = e.currentTarget.dataset;
    if (!query.next || Number(status) !== constants.couponStatus.available) {
      return;
    }
    this.setState({ couponids: ([id]), couponType: type });
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
    const usable = this.props.selectCoupon ? this.props.selectCoupon.data.usable_coupon : [];
    const disable = this.props.selectCoupon ? this.props.selectCoupon.data.disable_coupon : [];
    const { activeTab } = this.state;
    let coupons = [];
    switch (activeTab) {
      case 0:
        coupons = usable;
        break;
      case 1:
        coupons = disable;
        break;
      default:
    }
    return coupons;
  }

  searchSameCoupons = () => {
    const { query } = this.props.location;
    const goodsnum = query.goodsnum;
    const usable = this.props.selectCoupon ? this.props.selectCoupon.data.usable_coupon : [];
    let num = 0;

    for (let i = 0; i < usable.length; i++) {
      const item = usable[i];
      if (item.coupon_type === 8 && item.coupon_type === this.state.couponType) {
        const ids = [...this.state.couponids, item.id];
        console.log(ids);
        this.setState({ couponids: ids });
        num++;
        if (num === goodsnum) {
          break;
        }
      }
    }
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { query } = this.props.location;
    const usable = this.props.selectCoupon ? this.props.selectCoupon.data.usable_coupon : [];
    const disable = this.props.selectCoupon ? this.props.selectCoupon.data.disable_coupon : [];
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
              <li id="available" className={'col-xs-6' + (activeTab === couponStatus.available ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>可使用({usable && usable.length})</div>
              </li>
              <li id="used" className={'col-xs-6' + (activeTab === couponStatus.used ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>不可用({disable && disable.length})</div>
              </li>
            </ul>
          </div>
          <If condition={!_.isEmpty(coupons)}>
            <ul className="coupon-list">
              {coupons.map((item, index) => {
                return (
                  <Coupon status={item.status} couponItem={item} key={index} data-status={item.status} data-id={item.id} data-type={item.coupon_type} onClick={this.onCouponItemClick}/>
                );
              })}
            </ul>
          </If>
          <If condition={_.isEmpty(coupons)}>
            <div className="text-center coupon-list-empty">
              <i className="icon-coupon-o icon-6x font-grey"/>
              <p>您暂时还没有优惠劵哦～</p>
              <p className="font-xs font-grey-light">快去逛逛吧～</p>
              <Link className="col-xs-4 col-xs-offset-4 margin-bottom-lg button button-energized" to="/">快去抢购</Link>
            </div>
          </If>
          <If condition={query.next}>
            <div className="row no-margin">
              <button className="col-xs-10 col-xs-offset-1 button button-energized" type="button" onClick={this.onBtnClick}> 取消</button>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
