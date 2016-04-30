import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import * as orderAction from 'actions/order/order';

const actionCreators = _.extend({}, orderAction);

@connect(
  state => ({
    order: {
      data: state.profile.data,
      isLoading: state.profile.isLoading,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
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
    this.props.fetchOrders();
  }

  static types = [{
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

  render() {
    return (
      <div>
        <Header title="全部订单" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
          <div className="content has-header">
            <Footer />
          </div>
      </div>
    );
  }
}
