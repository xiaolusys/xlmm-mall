import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
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
            <div key={product.id} className="row no-margin bottom-border">
              <If condition={product.status === 1}>
                <div className="col-xs-3 no-padding">
                  <img src={product.pic_path + constants.image.square} />
                </div>
                <div className="col-xs-9 no-padding">
                  <p className="row no-margin">
                    <span>{product.title}</span>
                    <span className="pull-right">{'￥' + product.payment}</span>
                  </p>
                  <p className="row no-margin font-grey">
                    <span>{'尺码：' + product.sku_name}</span>
                    <span className="pull-right">{'x' + product.num}</span>
                  </p>
                </div>
              </If>
              <If condition={product.status !== 1}>
                <div className="col-xs-3 no-padding">
                  <img src={product.pic_path + constants.image.square} />
                </div>
                <div className="col-xs-9 no-padding">
                  <p className="row no-margin">
                    <span>{product.title}</span>
                    <span className="pull-right">{'￥' + product.payment}</span>
                  </p>
                  <p className="row no-margin font-grey">
                    <span>{'尺码：' + product.sku_name}</span>
                    <span className="pull-right">{'x' + product.num}</span>
                  </p>
                </div>
              </If>
            </div>
          );
        })}
      </div>
    );
  }

  renderLogistics() {
    const order = this.props.order.fetchOrder.data;
    const time = order.created || '';
    const content = '订单创建成功';
    return (
      <Link to={'/order/logistics/' + order.tid}>
      <Timeline className="logistics-info">
        <TimelineItem className="row no-margin" headColor="yellow" tailColor="yellow">
          <div className="col-xs-11 no-padding">
          <p className="font-grey">{time.replace('T', ' ')}</p>
          <p className="font-sm">{content}</p>
          </div>
          <i className="col-xs-1 no-padding margin-top-xs icon-angle-right icon-2x icon-grey pull-right"></i>
        </TimelineItem>
      </Timeline>
      </Link>
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
          <div className="content order-detail">
          {this.props.order.fetchOrder.isLoading ? <Loader/> : null}
          <p className="order-status">
            <sapn>订单编号</sapn>
            <sapn className="margin-left-xxs font-grey">{order.id}</sapn>
            <sapn className="pull-right font-yellow">{order.status_display}</sapn>
          </p>
          <div className="row receiver-info">
            <div className="col-xs-2">
            </div>
            <div className="col-xs-10">
              <p><span>{order.receiver_name}</span><span className="margin-left-xxs">{order.receiver_mobile}</span></p>
              <p className="font-xs">{order.receiver_state + order.receiver_city + order.receiver_district + order.receiver_address}</p>
            </div>
          </div>
          {this.renderLogistics()}
          {this.renderProducts(order.orders)}
          <div className="price-info">
            <p><span>商品金额</span><span className="pull-right font-yellow">{'￥' + Number(order.payment).toFixed(2)}</span></p>
            <p><span>优惠券</span><span className="pull-right font-yellow">{'-￥' + Number(order.discount_fee).toFixed(2)}</span></p>
            <p><span>运费</span><span className="pull-right font-yellow">{'￥' + Number(order.post_fee).toFixed(2)}</span></p>
          </div>
           <p className="pull-right margin-top-xxs margin-right-xxs"><span>总金额 ：</span><span className="font-yellow font-lg">{'￥' + Number(order.total_fee).toFixed(2)}</span></p>
        </div>
      </div>
    );
  }
}
