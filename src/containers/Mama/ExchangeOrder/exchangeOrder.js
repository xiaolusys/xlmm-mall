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
    fetchExchangedOrders: React.PropTypes.func,
    fetchWaitingExchgOrders: React.PropTypes.func,
    resetCanExchgOrders: React.PropTypes.func,
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
    activeTab: 'default',
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

    if (nextProps.boutiqueCoupon.exchangeOrder.success && nextProps.boutiqueCoupon.exchangeOrder.data && exchangeOrder.isLoading) {
      if (nextProps.boutiqueCoupon.exchangeOrder.data.code === 2) {
        this.setState({ isShowDialog: true });
        Toast.show(nextProps.boutiqueCoupon.exchangeOrder.data.info);
      } else {
        Toast.show(nextProps.boutiqueCoupon.exchangeOrder.data.info);
      }
    }

    if (!nextProps.boutiqueCoupon.exchangeOrder.success && nextProps.boutiqueCoupon.exchangeOrder.error) {
      if (nextProps.boutiqueCoupon.exchangeOrder.status === 500) {
        Toast.show(nextProps.boutiqueCoupon.exchangeOrder.data.detail);
      }
    }

    if (exchangeOrder.isLoading && !nextProps.boutiqueCoupon.exchangeOrder.isLoading && !mamaCanExchgOrders.isLoading) {
      this.props.resetCanExchgOrders();
      this.props.fetchCanExchgOrders();
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onTabItemClick = (e) => {
    const { type } = e.currentTarget.dataset;
    this.setState({
      activeTab: type,
      pageIndex: 0,
      status: 0,
      rselected: 0,
    });
    if (type === 'default') {
      this.props.resetCanExchgOrders();
      this.props.fetchCanExchgOrders();
    } else if (type === 'waiting') {
      this.props.resetCanExchgOrders();
      this.props.fetchWaitingExchgOrders();
    } else if (type === 'exchanged') {
      this.props.resetCanExchgOrders();
      this.props.fetchExchangedOrders();
    }
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.return-list-tabs');

    if (scrollTop > tabsOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  onLeftBtnClick = (e) => {
    this.context.router.goBack();
  }

  onExchgClick = (e) => {
    const { templateid, num, order, status, modelid, exchgPayment } = e.currentTarget.dataset;
    if (Number(status) !== 2) {
      Toast.show('订单还未发货，未到确认收益状态，还无法兑换');
      e.preventDefault();
      return;
    }
    this.setState({ templateId: templateid, exchgModelId: modelid });
    this.props.exchgOrder(order, templateid, num, exchgPayment);
    e.preventDefault();
  }

  onCancelBtnClick = (e) => {
    this.setState({ isShowDialog: false });
    e.preventDefault();
  }

  onAgreeBtnClick = (e) => {
    this.setState({ isShowDialog: false });
    e.preventDefault();
    if (!isNaN(this.state.exchgModelId) && Number(this.state.exchgModelId) !== 0) {
      this.context.router.push('/buycoupon?modelid=' + this.state.exchgModelId);
    } else {
      this.context.router.push('/trancoupon/list');
    }
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
        <div className="col-xs-12 order-time1 margin-top-xxs">
          <p className="text-left font-xs no-padding no-margin">{member.sku_name.substring(0, 27)}</p>
        </div>
        <div className="col-xs-4 member-img-div no-padding">
          <img className="member-img" src={member.sku_img} />
        </div>
        <div className="col-xs-6">
          <div className="col-xs-12 no-padding">
            <p className="text-left font-xs no-padding no-margin">{member.contributor_nick}</p>
            <p className="text-left font-xs no-padding no-margin">{member.status_display}</p>
          </div>
          <div className="col-xs-12 no-padding">
            <p className=" text-left font-xs">{'需券' + member.num + '张' + '可兑' + (member.exchg_payment).toFixed(1) + '元'}</p>
          </div>
        </div>
        <If condition={ this.state.activeTab === 'default'}>
        <div className="col-xs-2">
          <button className="button icon-yellow" onClick={this.onExchgClick} data-templateid={member.exchg_template_id} data-modelid={member.exchg_model_id} data-num={member.num} data-order={member.order_id} data-status={member.status} data-exchgPayment={member.exchg_payment}>兑换</button>
        </div>
        </If>
      </li>
    );
  }

  renderExchgedMember = (member, index) => {

    return (
      <li key={index} className="col-xs-12 member-item bottom-border" data-index={index} >
        <div className="col-xs-12 order-time no-padding">
          <p className=" text-left no-padding">{member.date_field ? member.date_field.replace(/T/, ' ') : ''}</p>
        </div>
        <div className="col-xs-12 order-time1 no-padding">
          <p className="text-left font-xs no-padding no-margin">{member.sku_name.substring(0, 27)}</p>
        </div>
        <div className="col-xs-4 member-img-div no-padding">
          <img className="member-img" src={member.sku_img} />
        </div>
        <div className="col-xs-6">
          <div className="col-xs-12 no-padding">
            <p className="text-left font-xs no-padding no-margin">{member.contributor_nick}</p>
            <p className="text-left font-xs no-padding no-margin">{member.status_display}</p>
          </div>
          <div className="col-xs-12 no-padding">
            <p className=" text-left font-xs">{'用券' + member.num + '张' + '已兑换'}</p>
          </div>
        </div>
      </li>
    );
  }

  render() {
    const { mamaCanExchgOrders } = this.props.boutiqueCoupon;
    const { activeTab, sticky } = this.state;

    return (
      <div className="exchgorder-container no-padding">
        <Header title="精品券兑换订单" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="jump-div bg-white bottom-border">
          <p className="font-blue font-xs" >说明：客户购买精品商品后精英妈妈可以使用精品券兑换获取收益。订单发货后进入确认收益状态即可兑换，未发货前无法兑换。客户退货会扣除妈妈已兑换的钱，并返还精品券；如果钱不够扣除，券会冻结。</p>
        </div>
        <div className={'return-list-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + 'has-header' }>
            <ul className="row no-margin">
              <li className={'col-xs-4' + (activeTab === 'default' ? ' active' : '')} data-type={'default'} onClick={this.onTabItemClick}>
                <div>可兑换</div>
              </li>
              <li className={'col-xs-4' + (activeTab === 'waiting' ? ' active' : '')} data-type={'waiting'} onClick={this.onTabItemClick}>
                <div>待兑换</div>
              </li>
              <li className={'col-xs-4' + (activeTab === 'exchanged' ? ' active' : '')} data-type={'exchanged'} onClick={this.onTabItemClick}>
                <div>已兑换</div>
              </li>
            </ul>
          </div>
        <div className="tran-coupons bg-white">
          <If condition={mamaCanExchgOrders.success && mamaCanExchgOrders.data && mamaCanExchgOrders.data.length > 0}>
            <ul className="bg-white">
            <If condition={activeTab === 'default' || activeTab === 'waiting'}>
            {mamaCanExchgOrders.data.map((item, index) => this.renderMember(item, index))
            }
            </If>
            <If condition={activeTab === 'exchanged'}>
            {mamaCanExchgOrders.data.map((item, index) => this.renderExchgedMember(item, index))
            }
            </If>
            </ul>
          </If>
          <If condition={mamaCanExchgOrders.success && mamaCanExchgOrders.data && mamaCanExchgOrders.data.length === 0}>
            <div className="no-coupon-members bg-white">
              <p className=" font-xs" >{'您没有' + ((activeTab === 'default' || activeTab === 'waiting') ? '订单可以兑换' : '已兑换的订单') + '，赶紧去分享商品吧'}</p>
            </div>
          </If>
        </div>
        <Dialog active={this.state.isShowDialog} title="小鹿提醒" content="您兑换此订单商品所需要的精品券数量不足，请点击同意前往购买。" onCancelBtnClick={this.onCancelBtnClick} onAgreeBtnClick={this.onAgreeBtnClick}/>
      </div>
    );
  }
}
