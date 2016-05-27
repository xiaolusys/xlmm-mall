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
    this.props.fetchRefundsDetail(this.props.params.id);
  }

  onRefundsInfoBtnClick = (e) => {
    this.setState({ refundsInfoIsShow: true });
  }

  toggleRefundsInfoIsShowState = (e) => {
    this.setState({ refundsInfoIsShow: false });
  }

  render() {
    const { isLoading, data } = this.props;
    console.log(data);
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
        <Header title="退换货详情" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content refunds">
          <ul className="refunds-details-list">
            <li className="row no-margin bottom-border">
              <p className="col-xs-6 no-margin text-left">
                <span className="text-left">订单编号</span>
                <span className="margin-left-xs font-grey-light">{data.order_id}</span>
              </p>
              <p className="col-xs-6 no-margin text-right font-orange">
                <span>{data.status_display}</span>
              </p>
            </li>
            <If condition={data.status > 2}>
              <li className="row no-margin padding-right-xs padding-top-xxs padding-bottom-xxs bottom-border">
                <button className="button button-light button-sm pull-right" type="button" onClick={this.onRefundsInfoBtnClick}>退货地址信息</button>
              </li>
              <li className="row no-margin bottom-border">
                <p className="col-xs-10 no-margin font-orange">填写物流信息</p>
                <i className="col-xs-2 icon-angle-right font-grey-light text-right"></i>
              </li>
            </If>
            <li className="row no-margin bottom-border">
              <div className="col-xs-3">
                <Image className="login-banner border" thumbnail={70} crop={70 + 'x' + 70} quality={100} src={data.pic_path}/>
              </div>
              <div className="col-xs-9">
                <p className="row padding-top-xxs padding-bottom-xxs">
                  <span className="col-xs-8 no-wrap">{data.title}</span>
                  <span className="col-xs-4 text-right">{data.total_fee}</span>
                </p>
                <p className="row font-grey-light">
                  <span className="col-xs-8">尺码:{data.sku_name}</span>
                  <span className="col-xs-4 text-right"></span>
                </p>
              </div>
            </li>
            <li className="row no-margin bottom-border">
              <p className="col-xs-8 no-margin">申请数量</p>
              <p className="col-xs-4 no-margin text-right font-grey-light">{data.refund_num}</p>
            </li>
            <li className="row no-margin bottom-border">
              <p className="col-xs-4 no-margin">退款金额</p>
              <p className="col-xs-8 no-margin text-right font-orange">¥{data.refund_fee}</p>
            </li>
            <li className="row no-margin margin-top-xs bottom-border">
              <p className="col-xs-4 no-margin">退款原因</p>
              <p className="col-xs-8 no-margin text-right font-grey-light">{data.reason}</p>
            </li>
            <If condition={!_.isEmpty(data.proof_pic)}>
              <li className="row no-margin bottom-border">
                {data.proof_pic.map((item, index) => {
                  return (
                    <Image className="login-banner border margin-left-xs" thumbnail={60} crop={60 + 'x' + 60} quality={100} src={data.pic_path}/>
                  );
                })}
              </li>
            </If>
            <If condition={!_.isEmpty(statusList)}>
              <li className="row no-margin margin-top-xs padding-left-xs bottom-border">
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
          <If condition={this.state.refundsInfoIsShow}>
            <div className="popup" onClick={this.toggleRefundsInfoIsShowState}>
              <div className="content">
              </div>
              <div className="popup-overlay">
                <div className="row margin-left-xxs margin-right-xxs refunds-address-info">
                  <p className="font-xlg text-center">退货地址信息</p>
                  <p className="text-center font-md">{data.return_address}</p>
                  <p className="text-center font-md">请将包裹里原发货单一并寄回或者写张纸条注明您的微信昵称、联系电话和退货原因，方便我们售后收到及时为您处理。</p>
                  <div className="row no-margin margin-top-xs">
                    <i className="col-xs-4 margin-right-xs icon-headset font-orange font-md text-right"></i>
                    <Link className="font-orange text-left text-underliner" to="">联系客服</Link>
                  </div>
                </div>
              </div>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
