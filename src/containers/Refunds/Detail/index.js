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
import { Statusline, StatuslineItem } from 'components/Statusline';
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
    const data = this.props.data;
    const { refundsid, orderid, type } = e.currentTarget.dataset;
    if (type === 'fill') {
      this.context.router.push(`/refunds/express/fill/${refundsid}/${orderid}/${encodeURIComponent('请选择物流公司')}`);
    } else {
      this.context.router.push(`/refunds/express/find?refundsId=${refundsid}&packageId=${data.sid}&companyName=${data.company_name}`);
    }
    e.preventDefault();
  }

  toggleRefundsInfoIsShowState = (e) => {
    this.setState({ refundsInfoIsShow: false });
    e.preventDefault();
  }

  renderRefundsList = (refundStatusList, statuslineWidth, data) => {
    return (
      <div className="refund-status-list">
        <table className="margin-bottom-xxs">
          <thead><tr>
            {_.map(refundStatusList, function(item, key) {
              const index = Number(key);
              return (
                <Choose>
                  <When condition={index === data.status}>
                    <th key={index} className="font-xxs font-weight-200 font-orange text-center">
                      {item.display}
                    </th>
                  </When>
                  <When condition={index !== data.status}>
                    <th key={index} className="font-xxs font-weight-200 text-center">
                      {item.display}
                    </th>
                  </When>
                </Choose>
              );
            })}
          </tr></thead>
        </table>
        <Statusline width={statuslineWidth}>
          {_.map(refundStatusList, function(item, key) {
            const index = Number(key);
            return (
              <div className="inline-block">
                <If condition={index === data.status}>
                  <StatuslineItem key={index} headColor="yellow" tailColor="yellow">
                    <p/>
                  </StatuslineItem>
                </If>
                <If condition={index !== data.status}>
                  <StatuslineItem key={index} headColor="grey" tailColor="grey">
                    <p/>
                  </StatuslineItem>
                </If>
              </div>
            );
          })}
        </Statusline>
      </div>
    );
  }

  renderRefundsAddress = (data) => {
    return (
      <div className="row no-margin margin-bottom-xs padding-right-xs padding-top-xxs padding-bottom-xxs bottom-border">
        <If condition={(data.has_good_return && data.status < 4) || !data.has_good_return}>
          <div className="col-xs-12">
            <p className="no-wrap no-margin">
              <span className="margin-right-xxs">{data.return_address.split('，')[2]}</span>
              <span>{data.return_address.split('，')[1]}</span>
            </p>
            <p className="no-wrap no-margin font-grey-light">{data.return_address.split('，')[0]}</p>
          </div>
        </If>
        <If condition={data.has_good_return && data.status >= 4}>
          <div className="col-xs-8">
            <p className="no-wrap no-margin">
              <span className="margin-right-xxs">{data.return_address.split('，')[2]}</span>
              <span>{data.return_address.split('，')[1]}</span>
            </p>
            <p className="no-wrap no-margin font-grey-light">{data.return_address.split('，')[0]}</p>
          </div>
          <button className="margin-top-xxs button button-light button-sm pull-right" type="button" data-orderid={data.order_id} data-refundsid={this.props.params.refundsid} data-type={data.status === 4 ? 'fill' : 'find'} onClick={this.onExpressBtnClick}>{data.status === 4 ? '填写快递单' : '查看物流'}</button>
        </If>
      </div>
    );
  }

  render() {
    const { isLoading, data } = this.props;
    let refundStatusList = {};
    let statuslineWidth = '';
    if (data && data.has_good_return) {
      refundStatusList = {
        3: { display: '申请退货' },
        4: { display: '同意申请' },
        5: { display: '填写快递单' },
        6: { display: '等待返款' },
        7: { display: '退款成功' },
      };
      statuslineWidth = 400 + 'px';
    } else if (data && !data.has_good_return) {
      refundStatusList = {
        3: { display: '申请退款' },
        4: { display: '同意申请' },
        6: { display: '等待返款' },
        7: { display: '退款成功' },
      };
      statuslineWidth = 320 + 'px';
    }
    return (
      <div className="refunds-details">
        <Header title="退货详情" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content refunds">
          <If condition={data.status}>
            {this.renderRefundsList(refundStatusList, statuslineWidth, data)}
          </If>
          <div className="refunds-details-list">
            <div className="row no-margin bottom-border">
              <p className="col-xs-8 no-margin no-padding text-left">
                <span className="col-xs-5 text-left">退款编号</span>
                <span className="col-xs-7 no-padding no-wrap font-grey-light">{data.refund_no}</span>
              </p>
              <p className="col-xs-4 no-margin text-right font-orange">
                <span>{data.status_display}</span>
              </p>
            </div>
            <If condition={data.status}>
              {this.renderRefundsAddress(data)}
            </If>
            <div className="row no-margin bottom-border">
              <div className="col-xs-3">
                <Image className="login-banner border" thumbnail={60} crop={60 + 'x' + 60} quality={100} src={data.pic_path}/>
              </div>
              <div className="col-xs-9">
                <p className="row no-margin padding-top-xxs padding-bottom-xxs">
                  <span className="col-xs-12 no-padding no-wrap">{data.title}</span>
                </p>
                <p className="row no-margin font-grey-light">
                  <span className="col-xs-8 no-padding no-wrap">尺码: {data.sku_name}</span>
                  <span className="padding-left-xs">{'¥' + data.total_fee + ' x' + data.refund_num}</span>
                </p>
              </div>
            </div>
            <div className="row no-margin bottom-border">
              <p className="col-xs-8 no-margin">申请数量</p>
              <p className="col-xs-4 no-margin text-right font-grey-light">{data.refund_num}</p>
            </div>
            <div className="row no-margin bottom-border">
              <p className="col-xs-4 no-margin">可退金额</p>
              <p className="col-xs-8 no-margin text-right font-orange">¥{data.refund_fee}</p>
            </div>
            <div className="row no-margin bottom-border">
              <p className="col-xs-4 no-margin">退款原因</p>
              <p className="col-xs-8 no-margin text-right font-grey-light">{data.reason}</p>
            </div>
            <If condition={!_.isEmpty(data.proof_pic)}>
              <div className="row no-margin bottom-border">
                {data.proof_pic.map((item, index) => {
                  return (
                    <Image className="login-banner border margin-left-xs margin-bottom-xxs" thumbnail={60} crop={60 + 'x' + 60} quality={100} src={item}/>
                  );
                })}
              </div>
            </If>
          </div>
        </div>
      </div>
    );
  }
}
