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
    params: React.PropTypes.obejct,
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

  renderProducts(products = []) {
    return (
      <div>
        <If condition={products.length === 1}>
          {products.map((product, index) => {
            <div className="row">
            <div className="col-xs-3">
              <img src={product.pic_path} />
            </div>
            <div className="col-xs-7">
              <p>{product.title}</p>
              <p>{'尺码：' + product.title}</p>
            </div>
            <div className="col-xs-2">
              <p>{'￥' + product.payment}</p>
              <p>{'x' + product.num}</p>
            </div>
            </div>;
          })}
        </If>
      </div>
    );
  }

  render() {
    const type = types[this.props.params.type];
    return (
      <div>
        <Header title={type.title} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content has-header">
            <Footer />
          </div>
      </div>
    );
  }
}
