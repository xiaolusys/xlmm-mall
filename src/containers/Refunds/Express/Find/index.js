import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Timeline, TimelineItem } from 'components/Timeline';
import * as refundsDetailsAction from 'actions/refunds/detail';
import * as refundsLogisticsAction from 'actions/refunds/logistics';

import './index.scss';

const actionCreators = _.extend(refundsDetailsAction, refundsLogisticsAction);

@connect(
  state => ({
    refundsDetails: state.refundsDetails,
    refundsLogistics: state.refundsLogistics,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Find extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    error: React.PropTypes.bool,
    refundsDetails: React.PropTypes.object,
    refundsLogistics: React.PropTypes.any,
    fetchRefundsDetail: React.PropTypes.func,
    fetchRefundsLogistics: React.PropTypes.func,
    resetRefundsLogistics: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  componentWillMount() {
    const { refundsId, packageId, companyName } = this.props.location.query;
    if (_.isEmpty(this.props.refundsDetails.data)) {
      this.props.fetchRefundsDetail(refundsId);
    }
    if (refundsId && packageId && companyName) {
      this.props.fetchRefundsLogistics(refundsId, packageId, companyName);
    }
  }

  componentWillUnmount() {
    this.props.resetRefundsLogistics();
  }

  renderRefunsLogistics = (logisticsList) => {
    return (
      <div className="row no-margin margin-top-xs padding-left-xs bottom-border">
        <Timeline className="margin-left-xxs">
          {logisticsList.map((item, index) => {
            return (
              <TimelineItem key={index} headColor="grey" tailColor="grey">
                <p className="font-grey">{item.time.replace('T', ' ')}</p>
                <p className="font-sm">{item.content}</p>
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>
    );
  }

  render() {
    const { refundsDetails, refundsLogistics } = this.props;
    const refundsDetailsData = refundsDetails.data || {};
    const refundsLogisticsData = refundsLogistics.data || {};
    return (
      <div className="find-logistics-info">
        <Header title="退货物流" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content">
          <div className="row express-item refunds-address border">
            <p className="text-center font-xlg font-weight-800 margin-top-xs">收货地址</p>
            <If condition={refundsDetailsData.return_address}>
              <div className="bottom-border">
                <p className="text-left no-margin">
                  <span className="margin-right-xs">{'收货人：' + refundsDetailsData.return_address.split('，')[2]}</span>
                  <span>{'联系电话：' + refundsDetailsData.return_address.split('，')[1]}</span>
                </p>
                <p className="no-margin font-grey-light">{refundsDetailsData.return_address.split('，')[0]}</p>
              </div>
            </If>
            <div>
              <p>为提高您的退货退款效率，请注意一下事项</p>
              <p>1.填写退货单or小纸条一并寄回，写明您的<span className="font-orange">微信昵称、联系电话、退换货原因</span></p>
              <p>2.勿发顺丰或EMS高等邮费快递</p>
              <p>3.请先支付邮费，拒收到付件。收货验收后，货款和运费将分开退还到您的相应帐户</p>
              <p>4.请保持衣服吊牌完整，不影响商品后续处理</p>
            </div>
          </div>
          <If condition={!_.isEmpty(refundsLogisticsData)}>
            <div className="content-white-bg padding-top-xxs padding-bottom-xxs padding-left-xs">
              <If condition={refundsLogisticsData.order}>
                <p className="row no-margin">{`快递公司：${refundsLogisticsData.name}`}</p>
              </If>
              <If condition={refundsLogisticsData.order}>
                <p className="row no-margin">{`快递单号：${refundsLogisticsData.order}`}</p>
              </If>
            </div>
            {this.renderRefunsLogistics(refundsLogisticsData.data)}
          </If>
        </div>
      </div>
    );
  }
}
