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
import * as userCouponAction from 'actions/user/coupons';

import './boutiqueCoupon.scss';

const actionCreators = _.extend(boutiqueCouponAction, userCouponAction);

@connect(
  state => ({
    boutiqueCoupon: state.boutiqueCoupon,
    coupons: state.coupons,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class BoutiqueCoupon extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    boutiqueCoupon: React.PropTypes.any,
    fetchMamaLeftTranCoupon: React.PropTypes.func,
    coupons: React.PropTypes.any,
    fetchUnusedBoutiqueCoupons: React.PropTypes.func,
    fetchFreezedBoutiqueCoupons: React.PropTypes.func,
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
    // this.props.fetchMamaLeftTranCoupon();
    this.props.fetchUnusedBoutiqueCoupons();
    this.props.fetchFreezedBoutiqueCoupons();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaLeftTranCoupon } = this.props.boutiqueCoupon;
    const { unusedBotique } = this.props.coupons;

    if (mamaLeftTranCoupon.isLoading || unusedBotique.isLoading) {
      utils.ui.loadingSpinner.show();
    }

    if (!nextProps.boutiqueCoupon.mamaLeftTranCoupon.isLoading && !nextProps.coupons.unusedBotique.isLoading) {
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

  directReturnClick = (e) => {
    const { index, type } = e.currentTarget.dataset;
    this.context.router.push('/mama/returncoupon/?index=' + index + '&type=' + type);
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
      <li key={index} className="col-xs-12 member-item bottom-border no-padding" data-index={index} >
        <div className="col-xs-3 member-img-div no-padding">
          <img className="col-xs-12 member-img no-padding" src={member.product_img} />
          <p className="col-xs-12 member-num text-center no-padding">{member.coupon_num + '张'}</p>
        </div>
        <div className="col-xs-9 member-detail no-padding">
          <div className="col-xs-12 bottom-border no-padding">
            <p className="col-xs-8 text-left font-xs no-padding">{'直接购买 ' + member.from_sys_coupon_ids.length + '张'}</p>
            <If condition={ false }>
              <button className="button button-sm button-light col-xs-3 font-xs return-btn no-padding" type="button" data-type={'direct'} data-index={index} onClick={this.directReturnClick} >退券</button>
            </If>
          </div>
          <div className="col-xs-12 bottom-border no-padding">
            <p className="col-xs-8 text-left font-xs no-padding">{'推荐人转券 ' + member.from_mama_coupon_ids.length + '张'}</p>
            <If condition={member.can_return_upper && member.from_mama_coupon_ids.length > 0 }>
              <button className="button button-sm button-light col-xs-3 font-xs return-btn no-padding" type="button" data-type={'indirect'} data-index={index} onClick={this.directReturnClick} >退券</button>
            </If>
          </div>
          <div className="col-xs-12 no-padding">
            <p className="text-left font-xs no-padding">{'赠送券 ' + member.gift_transfer_coupon_ids.length + '张'}</p>
          </div>
        </div>
      </li>
    );
  }

  render() {
    const { unusedBotique } = this.props.coupons;

    return (
      <div className="boutiquecoupon-container no-padding">
        <Header title="我的精品券" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="jump-div bg-white">
          <p className="font-blue font-xs" onClick={this.onJumpClick} >进入入券出券界面>>></p>
        </div>
        <div className="tran-coupons bg-white no-padding">
          <If condition={unusedBotique.success && unusedBotique.data && unusedBotique.data.length > 0}>
            <ul className="col-xs-12 no-padding tran-ul">
            {unusedBotique.data.map((item, index) => this.renderMember(item, index))
            }
            </ul>
          </If>
          <If condition={unusedBotique.success && unusedBotique.data && unusedBotique.data.length === 0}>
            <div className="no-coupon-members bg-white">
              <p className=" font-xs" >您没有任何精品券剩余，赶紧去逛逛吧</p>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
