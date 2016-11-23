import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import * as boutiqueCouponAction from 'actions/mama/boutiqueCoupon';

import './boutiqueCoupon.scss';

const actionCreators = _.extend(boutiqueCouponAction);

@connect(
  state => ({
    boutiqueCoupon: state.boutiqueCoupon,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class BoutiqueCoupon extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    boutiqueCoupon: React.PropTypes.any,
    fetchMamaLeftTranCoupon: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

    sticky: false,
    hasMore: false,

  }

  componentWillMount() {
    this.props.fetchMamaLeftTranCoupon();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaLeftTranCoupon } = this.props.boutiqueCoupon;

    if (mamaLeftTranCoupon.isLoading) {
      utils.ui.loadingSpinner.show();
    }

    if (!nextProps.boutiqueCoupon.mamaLeftTranCoupon.isLoading) {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
  }

  onLeftBtnClick = (e) => {
    this.context.router.goBack();
  }

  onJumpClick = (e) => {
    window.location.href = constants.baseUrl + '/tran_coupon/html/trancoupon.html';
    e.preventDefault();
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderMember = (member, index) => {

    return (
      <li key={index} className="col-xs-12 member-item bottom-border" data-index={index} onClick={this.onProductClick}>
        <div className="col-xs-4 member-img-div no-padding">
          <img className="member-img" src={member.product_img} />
        </div>
        <div className="col-xs-8">
          <p className="text-center ">{member.coupon_num + '张'}</p>
        </div>
      </li>
    );
  }

  render() {
    const { mamaLeftTranCoupon } = this.props.boutiqueCoupon;

    return (
      <div className="boutiquecoupon-container no-padding">
        <Header title="我的精品券" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="jump-div bg-white">
          <p className="font-blue font-xs" onClick={this.onJumpClick} >进入入券出券界面>>></p>
        </div>
        <div className="tran-coupons bg-white">
          <If condition={mamaLeftTranCoupon.success && mamaLeftTranCoupon.data && mamaLeftTranCoupon.data.results.length > 0}>
            <ul>
            {mamaLeftTranCoupon.data.results.map((item, index) => this.renderMember(item, index))
            }
            </ul>
          </If>
          <If condition={mamaLeftTranCoupon.success && mamaLeftTranCoupon.data && mamaLeftTranCoupon.data.results.length === 0}>
            <div className="no-coupon-members bg-white">
              <p className=" font-xs" >您没有任何精品券剩余，赶紧去逛逛吧</p>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
