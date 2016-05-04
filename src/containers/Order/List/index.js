import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
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
};

@connect(
  state => ({
    order: {
      data: state.order.data,
      isLoading: state.order.isLoading,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {

  static propTypes = {
    params: React.PropTypes.any,
    order: React.PropTypes.any,
    fetchOrders: React.PropTypes.func,
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
    const dataSet = e.currentTarget.dataset;
    switch (dataSet.action) {
      case displayTag['1'].action:
        console.log(dataSet.orderid);
        break;
      case displayTag['2'].action:
        break;
      case displayTag['3'].action:
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
                  <img src={product.pic_path} />
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
              <img key={product.id} src={product.pic_path} />
            );
          })}
        </If>
      </div>
    );
  }

  render() {
    const type = types[this.props.params.type];
    const orders = this.props.order.data.results || [];
    return (
      <div>
        <Header title={type.title} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content has-header">
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
                      <If condition={item.status === 1 || item.status === 1 || item.status === 3}>
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
            <Footer />
          </div>
      </div>
    );
  }
}
