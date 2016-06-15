import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import { Timeline, TimelineItem } from 'components/Timeline';
import * as utils from 'utils';
import * as actionCreators from 'actions/refunds/detail';

import './index.scss';

@connect(
  state => ({
    data: state.refundsDetails.data,
    isLoading: state.refundsDetails.isLoading,
    error: state.refundsDetails.error,
    success: state.refundsDetails.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Detail extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchRefundsDetail: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }
  state = {
    refundsInfoIsShow: false,
  }

  componentWillMount() {
    this.props.fetchRefundsDetail(this.props.params.refundsid);
  }

  onRefundsInfoBtnClick = (e) => {
    this.setState({ refundsInfoIsShow: true });
    e.preventDefault();
  }

  onExpressBtnClick = (e) => {
    const { refundsid, orderid } = e.currentTarget.dataset;
    this.context.router.push(`/refunds/express/order/${refundsid}/${orderid}/${encodeURIComponent('请选择物流公司')}`);
    e.preventDefault();
  }

  toggleRefundsInfoIsShowState = (e) => {
    this.setState({ refundsInfoIsShow: false });
    e.preventDefault();
  }

  render() {
    const { isLoading, data } = this.props;
    let statusList = [];
    if (!_.isEmpty(data.status_shaft)) {
      statusList = data.status_shaft.reverse();
    }
    if (isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    return (
      <div className="refunds-details">
        <Header title="退货详情" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content refunds">
          <ul className="refunds-details-list">
            <li className="row col-xs-12 no-margin bottom-border">
              <p className="col-xs-6 no-margin text-left">
                <span className="text-left">订单编号</span>
                <span className="margin-left-xs font-grey-light">{data.order_id}</span>
              </p>
              <p className="col-xs-6 no-margin no-padding text-right font-orange">
                <span>{data.status_display}</span>
              </p>
            </li>
            <p className="row col-xs-12 no-margin bottom-border text-right font-grey-light font-xs refunds-created">
              <span>下单时间: </span>
              <span>{data.created && data.created.replace('T', ' ') }</span>
            </p>
            <li className="row col-xs-12 no-margin padding-right-xs padding-top-xxs padding-bottom-xxs bottom-border">
              <If condition={data.status <= 4}>
                <div className="col-xs-8">
                  <p className="no-wrap no-margin">
                    <span className="margin-right-xxs">小鹿售后</span>
                    <span>021-50939326</span>
                  </p>
                  <p className="no-wrap no-margin font-grey-light">{data.return_address}</p>
                </div>
                <button className="margin-top-xxs button button-light button-sm pull-right" type="button" data-orderid={data.order_id} data-refundsid={this.props.params.refundsid} onClick={this.onExpressBtnClick}>填写快递单</button>
              </If>
              <If condition={data.status > 4}>
                <div className="col-xs-12">
                  <p className="no-wrap no-margin">
                    <span className="margin-right-xxs">小鹿售后</span>
                    <span>021-50939326</span>
                  </p>
                  <p className="no-wrap no-margin font-grey-light">{data.return_address}</p>
                </div>
              </If>
            </li>
            <li className="row col-xs-12 no-margin margin-top-xs bottom-border">
              <div className="col-xs-3">
                <Image className="login-banner border" thumbnail={70} crop={70 + 'x' + 70} quality={100} src={data.pic_path}/>
              </div>
              <div className="col-xs-9">
                <p className="row no-padding padding-top-xxs padding-bottom-xxs">
                  <span className="col-xs-9 no-wrap">{data.title}</span>
                  <span className="col-xs-3 no-padding text-right">{data.total_fee}</span>
                </p>
                <p className="row no-margin no-padding font-grey-light">
                  <span className="margin-right-xs">尺码: {data.sku_name}</span>
                  <span className=""></span>
                </p>
              </div>
            </li>
            <li className="row col-xs-12 no-margin bottom-border">
              <p className="col-xs-8 no-margin">申请数量</p>
              <p className="col-xs-4 no-margin no-padding text-right font-grey-light">{data.refund_num}</p>
            </li>
            <li className="row col-xs-12 no-margin bottom-border">
              <p className="col-xs-4 no-margin">退款金额</p>
              <p className="col-xs-8 no-margin no-padding text-right">¥{data.refund_fee}</p>
            </li>
            <li className="row col-xs-12 no-margin margin-top-xs bottom-border">
              <p className="col-xs-4 no-margin">退款原因</p>
              <p className="col-xs-8 no-margin no-padding text-right font-grey-light">{data.reason}</p>
            </li>
            <li className="row col-xs-12 no-margin bottom-border">
              <p className="col-xs-12 no-margin margin-bottom-xxs">{data.desc}</p>
              <If condition={!_.isEmpty(data.proof_pic)}>
                {data.proof_pic.map((item, index) => {
                  return (
                    <Image className="login-banner border margin-left-xs margin-bottom-xxs" thumbnail={60} crop={60 + 'x' + 60} quality={100} src={item}/>
                  );
                })}
              </If>
            </li>
            <If condition={!_.isEmpty(statusList)}>
              <li className="row col-xs-12 no-margin margin-top-xs padding-left-xs bottom-border">
              <Timeline className="logistics-info margin-left-xxs">
                {statusList.map((item, index) => {
                  return (
                    <TimelineItem key={index} headColor="grey" tailColor="grey">
                      <p className="font-grey">{item.time.replace('T', ' ')}</p>
                      <p className="font-sm">{item.status_display}</p>
                    </TimelineItem>
                  );
                })}
                </Timeline>
              </li>
            </If>
          </ul>
        </div>
      </div>
    );
  }
}
