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
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
export default class JimayOrderList extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    orders: React.PropTypes.object,
    fetchJimayOrders: React.PropTypes.func,
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
    const orders = nextProps.orders;
    console.log('jimayOrders', orders);
    if (orders.success && orders.data.code > 0) {
      Toast.show(orders.data.info);
    }
    if (orders.isLoading || orders.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    // this.props.resetApplyNegotiableCoupons();
  }

  render() {
    const orders = this.props.orders || {};
    const results = _.isEmpty(orders) ? [] : orders.data.results;
    console.log('results', results);
    return (
      <div className="shop-bag-all">
        <Header title="订货单列表" />
        <div className="content shop-bag-container">
          <If condition={_.isEmpty(results) && orders.success}>
            <div className="text-center margin-top-lg">
              <i className="icon-bag icon-6x icon-grey"></i>
              <p className="font-grey">你还没有任何订货记录，赶快下单试试吧!</p>
              <Link className="button button-stable" to="/jimay/order/create">申请订货</Link>
            </div>
          </If>
          <If condition={!_.isEmpty(results)}>
            <div className="text-center margin-top-lg">
              <Link className="button button-stable" to="/jimay/order/create">申请订货</Link>
            </div>
            <p className="margin-top-sm margin-left-xs font-xs">订货记录</p>
            <ul className="shop-bag-list top-border">
              {_.isEmpty(results) || orders.error ? null : results.map((item) => {
                return (
                  <li key={item.id} className="row no-margin bottom-border">
                    <a className="col-xs-3 no-padding">
                      <img src={item.pic_path + constants.image.square} />
                    </a>
                    <div className="col-xs-9 no-padding">
                      <p className="no-wrap">{item.title}</p>
                      <p className="font-xs font-grey-light">{item.sku_name}</p>
                      <p>
                        <span className="font-lg font-orange">{'￥' + item.payment}</span>
                        <span className="font-grey-light">{'/￥' + item.total_fee}</span>
                        <span className="font-md font-orange pull-right margin-right-xs">{constants.jimayOrderStatus[item.status]}</span>
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
