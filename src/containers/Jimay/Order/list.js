import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { wrapReactLifecycleMethodsWithTryCatch } from 'react-component-errors';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { BottomBar } from 'components/BottomBar';
import _ from 'underscore';
import * as constants from 'constants';
import * as utils from 'utils';
import * as plugins from 'plugins';
import * as jimayOrdersAction from 'actions/order/jimay';

import './index.scss';

const actionCreators = _.extend({}, jimayOrdersAction);
@connect(
  state => ({
    orders: state.jimayOrderList,
    cancelOrder: state.jimayOrder,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
export default class JimayOrderList extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    orders: React.PropTypes.object,
    fetchJimayOrders: React.PropTypes.func,
    cancelJimayAgentOrder: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
  }

  componentWillMount() {
    this.props.fetchJimayOrders();
  }

  componentWillReceiveProps(nextProps) {
    const { orders, cancelOrder } = nextProps;
    if (orders.success && orders.data.code > 0) {
      Toast.show(orders.data.info);
    }
    if (orders.isLoading || orders.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (cancelOrder.success && cancelOrder.data.code > 0) {
      Toast.show(cancelOrder.data.info);
    }
    if (cancelOrder.success && cancelOrder.data.code === 0) {
      window.location.replace(window.location);
    }
  }

  componentWillUnmount() {
    // this.props.resetApplyNegotiableCoupons();
  }

  onClickCancelJimayAgentOrder = (e) => {
    const { oid } = e.currentTarget.dataset;
    this.props.cancelJimayAgentOrder({ id: oid });
    e.preventDefault();
  }

  onClickEnterAgentRelShip = (e) => {
    this.context.router.push('/jimay/agent');
  }

  render() {
    const orders = this.props.orders || {};
    const purchaseEnable = _.isEmpty(orders) ? false : orders.data.is_purchase_enable;
    const results = _.isEmpty(orders) ? [] : orders.data.results;
    window.document.title = '己美医学－心怀大爱，助人助己，传播健康，传递责任.';
    return (
      <div className="shop-bag-all">
        <Header title="订货单列表" rightText="我的关系" onRightBtnClick={this.onClickEnterAgentRelShip} />
        <div className="content shop-bag-container">
          <If condition={_.isEmpty(results) && orders.success }>
            <div className="text-center margin-top-lg">
              <i className="icon-bag icon-6x icon-grey"></i>
              <If condition={purchaseEnable}>
                <p className="font-grey">你还没有任何订货记录，赶快下单试试吧!</p>
                <Link className="button button-stable" to="/jimay/order/create">申请订货</Link>
              </If>
              <If condition={!purchaseEnable}>
                <p className="font-grey">你当前的等级不能直接订货，请联系上级帮助申请!</p>
                <Link className="button button-stable" to="/jimay/agent">联系导师订货</Link>
              </If>
            </div>
          </If>
          <If condition={!_.isEmpty(results)}>
            <div className="text-center margin-top-lg">
              <If condition={purchaseEnable}>
                <Link className="button button-stable" to="/jimay/order/create">申请订货</Link>
              </If>
              <If condition={!purchaseEnable}>
                <Link className="button button-stable" to="/jimay/agent">联系导师订货</Link>
              </If>
            </div>
            <p className="margin-top-sm margin-left-xs font-xs">订货记录</p>
            <ul className="shop-bag-list top-border">
              {_.isEmpty(results) || orders.error ? null : results.map((item) => {
                return (
                  <li key={item.id} className="row no-margin bottom-border order-item">
                    <div className="order-header clearfix">
                      <p >
                        <span className="margin-left-xs">订货号: </span>
                        <span className="margin-right-xs font-yellow">{item.id}</span>
                        <div className="pull-right margin-right-xs">
                          <span>订货时间: </span>
                          <span>{item.created.split('T')[0]}</span>
                        </div>
                      </p>
                    </div>
                    <a className="col-xs-3 no-padding ">
                      <img className="content" src={item.pic_path + constants.image.square} />
                    </a>
                    <div className="col-xs-9 no-padding">
                      <p>{item.title} <span className="font-italic font-grey">x {item.num}</span></p>
                      <p>
                        <span className="font-lg font-orange">{'￥' + item.payment * 0.01}</span>
                        <span className="font-grey-light">{'/￥' + item.total_fee * 0.01}</span>
                        <If condition={item.status === 0}>
                          <button className="button button-stable button-sm pull-right margin-right-xs" data-oid={item.id} onClick={this.onClickCancelJimayAgentOrder} >审核中，点击取消</button>
                        </If>
                        <If condition={item.status !== 0}>
                          <span className="font-md font-orange pull-right margin-right-xs">{constants.jimayOrderStatus[item.status]}</span>
                        </If>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </If>
        </div>
      </div>
    );
  }
}
