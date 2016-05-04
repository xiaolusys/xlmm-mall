import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Timeline, TimelineItem } from 'components/Timeline';
import * as orderAction from 'actions/order/order';

import './index.scss';

const actionCreators = _.extend({}, orderAction);

@connect(
  state => ({
    order: state.order,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Detail extends Component {

  static propTypes = {
    params: React.PropTypes.any,
    order: React.PropTypes.any,
    fetchOrder: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    this.props.fetchOrder(this.props.params.id);
  }

  renderProducts(products = []) {
    return (
      <div className="product-list">
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
      </div>
    );
  }

  renderLogistics() {
    return (
      <Timeline className="logistics-info">
        <TimelineItem headColor="yellow" tailColor="yellow">
          <p></p>
          <p>够傻几个佛我激动撒回复你度搜积分hi欧</p>
        </TimelineItem>
      </Timeline>
    );
  }

  renderBottomBar() {
    return (
      <div>
      </div>
    );
  }

  render() {
    const order = this.props.order.fetchOrder.data;
    return (
      <div>
        <Header title="订单详情" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content has-header order-detail">
            <p className="order-status">
              <sapn>订单编号</sapn>
              <sapn className="margin-left-xxs font-grey">{order.id}</sapn>
              <sapn className="pull-right font-yellow">{order.status_display}</sapn>
            </p>
            <div className="row receiver-info">
              <div className="col-xs-2">
              </div>
              <div className="col-xs-10">
                <p><span>{order.receiver_name}</span><span>{order.receiver_mobile}</span></p>
                <p className="font-xs">{order.receiver_state + order.receiver_city + order.receiver_district + order.receiver_address}</p>
              </div>
            </div>
            {this.renderLogistics()}
            {this.renderProducts(order.orders)}
            <div className="price-info">
              <p><span>商品金额</span><span className="pull-right">{'￥' + Number(order.payment).toFixed(2)}</span></p>
              <p><span>优惠券</span><span className="pull-right">{'-￥' + Number(order.discount_fee).toFixed(2)}</span></p>
              <p><span>运费</span><span className="pull-right">{'￥' + Number(order.post_fee).toFixed(2)}</span></p>
            </div>
             <p className="pull-right margin-top-xxs margin-right-xxs"><span>总金额 ：</span><span className="font-yellow font-lg">{'￥' + Number(order.total_fee).toFixed(2)}</span></p>
            <Footer />
          </div>
      </div>
    );
  }
}
