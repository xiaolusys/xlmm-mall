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
import { Toast } from 'components/Toast';
import { Dialog } from 'components/Dialog';
import * as boutiqueCouponAction from 'actions/mama/boutiqueCoupon';

import './exchangeOrder.scss';

const actionCreators = _.extend(boutiqueCouponAction);

@connect(
  state => ({
    boutiqueCoupon: state.boutiqueCoupon,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class ExchangeOrder extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    boutiqueCoupon: React.PropTypes.any,
    fetchCanExchgOrders: React.PropTypes.func,
    exchgOrder: React.PropTypes.func,
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
    isShowDialog: false,
    templateId: 0,
  }

  componentWillMount() {
    this.props.fetchCanExchgOrders();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaCanExchgOrders, exchangeOrder } = this.props.boutiqueCoupon;

    if (mamaCanExchgOrders.isLoading || exchangeOrder.isLoading) {
      utils.ui.loadingSpinner.show();
    }

    if (!nextProps.boutiqueCoupon.mamaCanExchgOrders.isLoading && !nextProps.boutiqueCoupon.exchangeOrder.isLoading) {
      utils.ui.loadingSpinner.hide();
    }

    if (nextProps.boutiqueCoupon.exchangeOrder.success && nextProps.boutiqueCoupon.exchangeOrder.data) {
      if (nextProps.boutiqueCoupon.exchangeOrder.data.code === 2) {
        this.setState({ isShowDialog: true });
        Toast.show(nextProps.boutiqueCoupon.exchangeOrder.data.info);
      } else {
        Toast.show(nextProps.boutiqueCoupon.exchangeOrder.data.info);
      }
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

  onExchgClick = (e) => {
    const { templateid, num, order, status } = e.currentTarget.dataset;
    if (Number(status) !== 2 ) {
      Toast.show("订单还未到确认收益状态，还无法兑换");
      e.preventDefault();
      return;
    }
    this.setState({ templateId: templateid });
    this.props.exchgOrder(order, templateid, num);
    e.preventDefault();
  }

  onCancelBtnClick = (e) => {
    this.setState({ isShowDialog: false });
    e.preventDefault();
  }

  onAgreeBtnClick = (e) => {

    this.setState({ isShowDialog: false });
    this.context.router.push('/trancoupon/list');
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
      <li key={index} className="col-xs-12 member-item bottom-border" data-index={index} >
        <div className="col-xs-12 order-time">
          <p className=" text-left no-padding">{member.date_field}</p>
        </div>
        <div className="col-xs-4 member-img-div no-padding">
          <img className="member-img" src={member.sku_img} />
        </div>
        <div className="col-xs-6">
          <div className="col-xs-12">
            <p className=" text-left font-xs">{member.contributor_nick}</p>
            <p className="text-left font-xs">{member.status_display}</p>
          </div>
          <div className="col-xs-12">
            <p className=" text-left font-xs">{member.num + '张'}</p>
          </div>
        </div>
        <div className="col-xs-2">
          <button className="button icon-yellow" onClick={this.onExchgClick} disabled={ member.status !== 2} data-templateid={member.exchg_template_id} data-num={member.num} data-order={member.order_id} data-status={member.status}>兑换</button>
        </div>
      </li>
    );
  }

  render() {
    const { mamaCanExchgOrders } = this.props.boutiqueCoupon;

    return (
      <div className="exchgorder-container no-padding">
        <Header title="我的精品券" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="jump-div bg-white">
          <p className="font-blue font-xs" >说明：分享出去的商品是精品汇商品，客户购买后精英妈妈可以使用精品券兑换获取收益。订单发货后进入确认收益状态即可兑换，未发货前无法兑换。</p>
        </div>
        <div className="tran-coupons bg-white">
          <If condition={mamaCanExchgOrders.success && mamaCanExchgOrders.data && mamaCanExchgOrders.data.length > 0}>
            <ul className="bg-white">
            {mamaCanExchgOrders.data.map((item, index) => this.renderMember(item, index))
            }
            </ul>
          </If>
          <If condition={mamaCanExchgOrders.success && mamaCanExchgOrders.data && mamaCanExchgOrders.data.length === 0}>
            <div className="no-coupon-members bg-white">
              <p className=" font-xs" >您没有订单可以兑换，赶紧去分享商品吧</p>
            </div>
          </If>
        </div>
        <Dialog active={this.state.isShowDialog} title="小鹿提醒" content="您兑换此订单商品所需要的精品券数量不足，请点击同意前往购买。" onCancelBtnClick={this.onCancelBtnClick} onAgreeBtnClick={this.onAgreeBtnClick}/>
      </div>
    );
  }
}
