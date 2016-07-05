import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Timeline, TimelineItem } from 'components/Timeline';
import * as logisticsAction from 'actions/order/logistics';
import * as orderAction from 'actions/order/order';

import './index.scss';

const actionCreators = _.extend(logisticsAction, orderAction);

@connect(
  state => ({
    logistics: state.logistics,
    order: state.order,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Logistics extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    order: React.PropTypes.any,
    params: React.PropTypes.any,
    logistics: React.PropTypes.object,
    isLoading: React.PropTypes.bool,
    fetchLogistics: React.PropTypes.func,
    fetchOrder: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    payTime: '',
    bookTime: '',
    assignTime: '',
    finishTime: '',
  }

  componentWillMount() {
    const packageGroupKey = this.props.location.query.key;
    const companyCode = this.props.location.query.companyCode;
    this.props.fetchOrder(this.props.location.query.id);
    this.props.fetchLogistics(packageGroupKey, companyCode);
  }

  componentWillReceiveProps(nextProps) {
    const packageGroupKey = this.props.location.query.key;
    const fetchOrder = nextProps.order.fetchOrder;
    const orderData = fetchOrder.data;
    if (nextProps.logistics.isLoading || fetchOrder.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (fetchOrder.success) {
      this.setState({
        payTime: orderData.pay_time,
        bookTime: orderData.book_time,
        assignTime: orderData.assign_time,
        finishTime: orderData.finish_time,
      });
    }
  }

  dealTimeList() {
    const state = this.state;
    const { logistics } = this.props || {};
    const logisticsInfo = logistics.data.data || [];
    const timeList = [
      { time: state.finishTime, content: '发货' },
      { time: state.assignTime, content: '入仓' },
      { time: state.bookTime, content: '订货' },
      { time: state.payTime, content: '支付成功' },
    ];
    return _.union(logisticsInfo, timeList);
  }

  renderPackages(packages = [], packageGroupKey) {
    const tradeId = this.props.params.tradeId;
    return (
      <div className="margin-top-xs order-list">
        {packages[packageGroupKey].map((order, i) => {
          return (
            <div key={i} className="row no-margin bottom-border">
              <div className="col-xs-3 no-padding">
                <img src={order.pic_path + constants.image.square} />
              </div>
              <div className="col-xs-9 no-padding">
                <p className="row no-margin">
                  <span className="col-xs-8 no-wrap no-padding">{order.title}</span>
                  <span className="pull-right">{'￥' + order.total_fee}</span>
                </p>
                <p className="row no-margin font-grey">
                  <span>{'尺码：' + order.sku_name}</span>
                  <span className="pull-right">{'x' + order.num}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { logistics, isLoading } = this.props || {};
    const logisticsInfo = this.dealTimeList();
    const { tradeId } = this.props.params;
    const packageGroupKey = this.props.location.query.key;
    const trade = this.props.order.fetchOrder.data || {};
    const packages = trade.orders || {};
    return (
      <div>
        <Header title="物流信息" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content package-content">
            <If condition={!_.isEmpty(packages)}>
              <p className="express-item bottom-border"><span>快递公司</span><span className="pull-right">{packages[packageGroupKey][0].logistics_company && packages[packageGroupKey][0].logistics_company.name || '小鹿推荐'}</span></p>
              <If condition={packages[packageGroupKey][0].logistics_company_code}>
                <p className="express-item bottom-border"><span>快递单号</span><span className="pull-right">{logistics.order || '暂无'}</span></p>
              </If>
              <If condition={!packages[packageGroupKey][0].logistics_company_code}>
                <p className="express-item bottom-border"><span>包裹状态</span><span className="pull-right font-orange">{packages[packageGroupKey][0].assign_status_display}</span></p>
              </If>
              {this.renderPackages(packages, packageGroupKey)}
            </If>
            <If condition={!_.isEmpty(logisticsInfo)}>
              <div className="logistics-item margin-top-xs">
                <Timeline className="logistics-info">
                {logisticsInfo.map((item, index) => {
                  return (
                    <div>
                    <If condition={item.time}>
                      <TimelineItem key={index} headColor="yellow" tailColor="yellow">
                        <p className="font-orange">{item.time.replace('T', ' ')}</p>
                        <p className="font-sm font-orange">{item.content}</p>
                      </TimelineItem>
                    </If>
                    </div>
                  );
                })}
                </Timeline>
              </div>
            </If>
          </div>
      </div>
    );
  }
}
