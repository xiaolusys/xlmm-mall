import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import classnames from 'classnames';
import * as constants from 'constants';
import moment from 'moment';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Toast } from 'components/Toast';
import { Timer } from 'components/Timer';
import * as orderAction from 'actions/order/order';

import './index.scss';

const actionCreators = _.extend({}, orderAction);
const types = [{
  title: '全部订单',
  requestAction: '',
}, {
  title: '待支付',
  requestAction: 'waitpay',
}, {
  title: '待收货',
  requestAction: 'waitsend',
}, {
  title: '退换货',
  requestAction: '',
}];
const tabs = {
  all: 0,
  waitpay: 1,
  waitsend: 2,
};

@connect(
  state => ({
    order: state.order,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {

  static propTypes = {
    location: React.PropTypes.any,
    order: React.PropTypes.any,
    fetchOrders: React.PropTypes.func,
    resetOrders: React.PropTypes.func,
    deleteOrder: React.PropTypes.func,
    chargeOrder: React.PropTypes.func,
    confirmReceivedOrder: React.PropTypes.func,
    remindShipment: React.PropTypes.func,
    resetRemindShipment: React.PropTypes.func,
    resetChargeOrder: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    pageIndex: 0,
    pageSize: 20,
    hasMore: true,
    activeTab: 0,
    sticky: false,
  }

  componentWillMount() {
    const { query } = this.props.location;
    const requestAction = types[query.type].requestAction;
    const { pageIndex, pageSize } = this.state;
    this.props.fetchOrders(requestAction, pageIndex + 1, pageSize);
    this.setState({ activeTab: Number(query.type) || 0 });
    if (query.paid && query.paid === 'true') {
      window.ga && window.ga('send', {
        hitType: 'event',
        eventCategory: 'Pay',
        eventAction: 'Succeed',
        eventLabel: 'All',
      });
    } else if (query.paid && query.paid === 'false') {
      window.ga && window.ga('send', {
        hitType: 'event',
        eventCategory: 'Pay',
        eventAction: 'Failed',
        eventLabel: 'All',
      });
    }
  }

  componentDidMount() {
    this.props.resetOrders();
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { fetchOrders, chargeOrder, deleteOrder, remindShipment } = nextProps.order;
    if (chargeOrder.isLoading || deleteOrder.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (chargeOrder.success && chargeOrder.data.code === 0 && !_.isEmpty(chargeOrder.data.charge)) {
      this.pay(chargeOrder.data.charge, chargeOrder.data.trade);
      this.props.resetChargeOrder();
    } else if (chargeOrder.success && chargeOrder.data.info) {
      Toast.show(chargeOrder.data.info);
      this.props.resetChargeOrder();
    }
    if (fetchOrders.success) {
      const count = fetchOrders.data.count;
      const size = fetchOrders.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
    if (!remindShipment.isLoading && remindShipment.success && remindShipment.data.info) {
      Toast.show(remindShipment.data.info);
      this.props.resetRemindShipment();
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onBtnClick = (e) => {
    const requestAction = types[this.props.location.query.type].requestAction;
    const { router } = this.context;
    const dataSet = e.currentTarget.dataset;
    switch (dataSet.action) {
      case constants.tradeOperations['1'].action:
        this.props.chargeOrder(dataSet.orderid);
        break;
      case constants.tradeOperations['2'].action:
        this.props.remindShipment(dataSet.orderid);
        break;
      default:
        break;
    }
  }

  onTabItemClick = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const { id } = e.currentTarget;
    this.setState({
      activeTab: tabs[id],
      pageIndex: 0,
    });
    this.props.resetOrders();
    this.props.fetchOrders(types[tabs[id]].requestAction, 1, pageSize);
  }

  onScroll = (e) => {
    const requestAction = types[this.props.location.query.type].requestAction;
    const { pageSize, pageIndex, activeTab } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.order-tabs');
    if (scrollTop === documentHeight - windowHeight && !this.props.order.fetchOrders.isLoading && this.state.hasMore) {
      this.props.fetchOrders(types[activeTab].requestAction, pageIndex + 1, pageSize);
    }
    if (scrollTop > tabsOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  onBackClick = (e) => {
    this.context.router.replace('/');
  }

  getClosedDate = (dateString) => {
    const date = moment(dateString).toDate();
    date.setMinutes(date.getMinutes() + 20);
    return date.toISOString();
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  pay = (charge, trade) => {
    window.pingpp.createPayment(charge, (result, error) => {
      if (result === 'success') {
        window.location.replace(`${constants.paymentResults.success}/${trade.id}/${trade.tid}`);
        return;
      }
      window.location.replace(constants.paymentResults.error);
    });
  }

  renderOrders(products = []) {
    return (
      <div className="order-content">
        {products.map((product, index) => {
          return (
            <div key={product.id} className="row no-margin padding-left-xxs bottom-border">
              <div className="col-xs-3 no-padding">
                <img src={product.pic_path + constants.image.square} />
              </div>
              <div className="col-xs-9 no-padding padding-top-xxs font-xs">
                <p className="row no-margin no-wrap">{product.title}</p>
                <p className="row no-margin margin-top-xxxs font-grey">{'尺码:' + product.sku_name}</p>
                <p className="row no-margin margin-top-xxxs">
                  <span className="">{'￥' + (Number(product.num) > 0) ? (Number(product.total_fee) / Number(product.num)).toFixed(2) : 0}</span>
                  <span className="padding-left-xs">{'x' + product.num}</span>
                </p>
              </div>
            </div>
            );
          })}
      </div>
    );
  }

  render() {
    const type = types[this.props.location.query.type];
    const trades = this.props.order.fetchOrders.data.results || [];
    const { activeTab, sticky } = this.state;
    const hasHeader = !utils.detector.isApp();
    return (
      <div>
        <Header title={type.title} leftIcon="icon-angle-left" onLeftBtnClick={this.onBackClick} />
        <div className="content order-list">
          <div className={'order-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
            <ul className="row no-margin">
              <li id="all" className={'col-xs-4' + (activeTab === tabs.all ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>全部订单</div>
              </li>
              <li id="waitpay" className={'col-xs-4' + (activeTab === tabs.waitpay ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>待支付</div>
              </li>
              <li id="waitsend" className={'col-xs-4' + (activeTab === tabs.waitsend ? ' active' : '')} onClick={this.onTabItemClick}>
                <div>待收货</div>
              </li>
            </ul>
          </div>
          <If condition={_.isEmpty(trades) && this.props.order.fetchOrders.success && !this.props.order.fetchOrders.isLoading}>
            <div className="text-center order-list-empty">
              <i className="icon-order-o icon-6x icon-grey"></i>
              <p>您暂时还没有订单哦～快去看看吧</p>
              <p className="font-grey font-xs margin-bottom-xs">再不抢购，宝贝就卖光啦～</p>
              <Link className="button button-stable" to="/" >快去抢购</Link>
            </div>
          </If>
          { trades.map((item) => {
            return (
              <div className="order-item" key={item.id}>
                <div className="order-header bottom-border clearfix">
                  <p className="pull-left margin-left-xs">
                    <span className="margin-right-xs font-yellow">{item.status_display}</span>
                    <span>实付金额: </span>
                    <span>{'￥' + item.payment}</span>
                  </p>
                </div>
                <Link to={`/od.html?tid=${item.tid}&id=${item.id}&type=${activeTab}`}>
                  {this.renderOrders(item.orders)}
                </Link>
              </div>
            );
          })}
          {this.props.order.fetchOrders.isLoading ? <Loader/> : null}
        </div>
      </div>
    );
  }
}
