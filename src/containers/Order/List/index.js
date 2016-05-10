import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import classnames from 'classnames';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
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

const displayTag = {
  1: { tag: '立即支付', action: 'pay' }, // 1: 待付款
  2: { tag: '提醒发货', action: 'remind' }, // 2: 已付款
  3: { tag: '确认收货', action: 'confirm' }, // 3: 已发货
  5: { tag: '退货退款', action: 'refund' }, // 3: 交易成功
  7: { tag: '删除订单', action: 'delete' }, // 3: 交易关闭
};

@connect(
  state => ({
    order: state.order,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {

  static propTypes = {
    params: React.PropTypes.any,
    order: React.PropTypes.any,
    fetchOrders: React.PropTypes.func,
    deleteOrder: React.PropTypes.func,
    chargeOrder: React.PropTypes.func,
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
  }

  componentWillMount() {
    const requestAction = types[this.props.params.type].requestAction;
    const { pageIndex, pageSize } = this.state;
    this.props.fetchOrders(requestAction, pageIndex + 1, pageSize);
  }


  onBtnClick = (e) => {
    const requestAction = types[this.props.params.type].requestAction;
    const { router } = this.context;
    const { pageIndex, pageSize } = this.state;
    const dataSet = e.currentTarget.dataset;
    switch (dataSet.action) {
      case displayTag['1'].action:
        router.push('/order/pay/' + dataSet.id);
        break;
      case displayTag['2'].action:
        // TODO: 提醒发货
        break;
      case displayTag['3'].action:
        // TODO: 确认收货
        break;
      case displayTag['5'].action:
        router.push('/order/refund/' + dataSet.id);
        break;
      case displayTag['7'].action:
        this.props.deleteOrder(dataSet.orderid);
        break;
      default:
        break;
    }
  }

  renderProducts(products = []) {
    return (
      <div className="order-content">
        <If condition={products.length === 1}>
          {products.map((product, index) => {
            return (
              <div key={product.id} className="row no-margin">
                <div className="col-xs-3 no-padding">
                  <img src={product.pic_path + constants.image.square} />
                </div>
                <div className="col-xs-9 no-padding">
                  <p className="row no-margin">
                    <span className="col-xs-10 no-padding">{product.title}</span>
                    <span className="col-xs-2 no-padding">{'￥' + product.payment}</span>
                  </p>
                  <p className="row no-margin font-grey">
                    <span className="col-xs-10 no-padding">{'尺码：' + product.sku_name}</span>
                    <span className="col-xs-2 no-padding">{'x' + product.num}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </If>
        <If condition={products.length > 1}>
          {products.map((product, index) => {
            return (
              <img key={product.id} src={product.pic_path + constants.image.square} />
            );
          })}
        </If>
      </div>
    );
  }

  render() {
    const type = types[this.props.params.type];
    const orders = this.props.order.fetchOrder.data.results || [];
    return (
      <div>
        <Header title={type.title} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content order-list">
          {this.props.order.fetchOrder.isLoading ? <Loader/> : null}
            <If condition={_.isEmpty(orders) && !this.props.order.fetchOrder.isLoading}>
              <div className="text-center margin-top-xlg margin-bottom-lg">
                <i className="icon-order-o icon-4x icon-grey"></i>
                <p>您暂时还没有订单哦～快去看看吧</p>
                <p className="font-grey font-xs margin-bottom-xs">再不抢购，宝贝就卖光啦～</p>
                <Link className="button button-stable" to="/" >快去抢购</Link>
              </div>
            </If>
            { orders.map((item, index) => {
              return (
                <div className="order-item" key={item.id}>
                  <div className="order-header bottom-border clearfix">
                    <p className="pull-left margin-left-xxs">
                      <span>{'实付金额'}</span>
                      <span className="font-yellow">{'￥' + item.payment}</span>
                    </p>
                    <div className="pull-right">
                      <span className="margin-right-xxs">{item.status_display}</span>
                      <If condition={item.status === 1 || item.status === 2 || item.status === 3 || item.status === 5 || item.status === 7}>
                        <button type="button" data-action={displayTag[item.status].action} data-orderid={item.id} onClick={this.onBtnClick}>{displayTag[item.status].tag}</button>
                      </If>
                    </div>
                  </div>
                  <Link to={'order/detail/' + item.id}>
                    {this.renderProducts(item.orders)}
                  </Link>
                </div>
              );
            })}
          </div>
      </div>
    );
  }
}
