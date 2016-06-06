import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import { Popup } from 'components/Popup';
import { Toast } from 'components/Toast';
import { Timeline, TimelineItem } from 'components/Timeline';
import * as utils from 'utils';
import * as actionCreators from 'actions/refunds/apply';

import './index.scss';

const titles = {
  2: '申请退款',
  5: '申请退货',
};
const reasons = {
  0: '其他',
  1: '错拍',
  2: '缺货',
  3: '开线/脱色/脱毛/有色差/有虫洞',
  4: '发错货/漏发',
  5: '没有发货',
  6: '未收到货',
  7: '与描述不符',
  8: '退运费',
  9: '发票问题',
  10: '七天无理由退换货',
};

@connect(
  state => ({
    order: {
      data: state.refundsOrder.data,
      isLoading: state.refundsOrder.isLoading,
      error: state.refundsOrder.error,
      success: state.refundsOrder.success,
    },
    apply: {
      data: state.refundsApply.data,
      isLoading: state.refundsApply.isLoading,
      error: state.refundsApply.error,
      success: state.refundsApply.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Apply extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    order: React.PropTypes.any,
    apply: React.PropTypes.any,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchOrderById: React.PropTypes.func,
    pushRefundsApply: React.PropTypes.func,
    resetApply: React.PropTypes.func,
    resetOrder: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }
  state = {
    submitBtnDisabled: true,
    showPopup: false,
    reason: '',
    num: 0,
    sum_price: 0,
    description: '',
    proof_pic: [],
  }

  componentWillMount() {
    const params = this.props.params;
    this.props.fetchOrderById(params.tradeId, params.orderId);
  }

  componentDidMount() {
    this.props.resetApply();
    this.props.resetOrder();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order.success) {
      this.setState({ num: nextProps.order.data.num || 0 });
    }
    if (nextProps.apply.success) {
      Toast.show(nextProps.apply.data.info);
      if (nextProps.apply.data.code === 0) {
        this.context.router.goBack();
      }
    }
    if (nextProps.order.isLoading || nextProps.apply.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  onSubmitBtnClick = (e) => {
    const { order } = this.props;
    const state = this.state;
    const params = {
      id: order.data.id,
      reason: state.reasonIndex,
      num: state.num,
      sum_price: order.data.sum_price,
      description: state.description,
      proof_pic: '',
    };
    this.props.pushRefundsApply(params);
    e.preventDefault();
  }

  onReasonChange = (e) => {
    const reason = e.target.textContent;
    const index = e.target.dataset.reasonIndex;
    this.setState({ reason: reason, showPopup: false, reasonIndex: Number(index) });
    e.preventDefault();
  }

  onDesciptionChange = (e) => {
    this.setState({ description: e.target.value });
    e.preventDefault();
  }

  numMinus = (e) => {
    if (this.state.num >= 2) {
      this.setState({ num: this.state.num - 1 });
    }
    e.preventDefault();
  }

  numPlus = (e) => {
    if (this.state.num < this.props.order.data.num) {
      this.setState({ num: this.state.num + 1 });
    }
    e.preventDefault();
  }

  hidePopup = (e) => {
    this.setState({ showPopup: false });
    e.preventDefault();
  }

  showPopup = (e) => {
    this.setState({ showPopup: true });
    e.preventDefault();
  }

  render() {
    const { isLoading, order, apply } = this.props;
    let statusList = [];
    if (!_.isEmpty(order.data.status_shaft)) {
      statusList = order.data.status_shaft.reverse();
    }
    return (
      <div className="refunds-apply">
        <Header title={titles[apply.data.status] || ''} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content refunds">
          <ul className="refunds-apply-list">
            <li className="row col-xs-12 no-margin bottom-border">
              <div className="col-xs-3">
                <Image className="login-banner border" thumbnail={70} crop={70 + 'x' + 70} quality={100} src={order.data.pic_path}/>
              </div>
              <div className="col-xs-9 no-padding">
                <p className="row no-margin padding-top-xxs padding-bottom-xxs padding-left-xxs">
                  <span className="col-xs-9 no-wrap padding-left-xs">{order.data.title}</span>
                  <span className="col-xs-3 no-padding text-right">{'¥' + order.data.total_fee}</span>
                </p>
                <p className="row no-margin font-grey-light padding-left-xxs">
                  <span className="col-xs-9 padding-left-xs">尺码: {order.data.sku_name}</span>
                  <span className="col-xs-3 no-padding text-right">x1</span>
                </p>
              </div>
            </li>
            <li className="row col-xs-12 no-margin bottom-border">
              <p className="col-xs-6 no-margin">申请数量</p>
              <p className="col-xs-6 no-margin no-padding text-right font-grey-light">
                <i className="icon-minus padding-right-xxs font-orange" onClick={this.numMinus}></i>
                <span className="padding-right-xxs">{this.state.num}</span>
                <i className="icon-plus font-orange" onClick={this.numPlus}></i>
              </p>
            </li>
            <li className="row col-xs-12 no-margin bottom-border">
              <p className="col-xs-4 no-margin">可退金额</p>
              <p className="col-xs-8 no-margin no-padding text-right font-orange">{'¥' + order.data.payment}</p>
            </li>
            <li className="row col-xs-12 no-margin margin-top-xs bottom-border">
              <p className="col-xs-4 no-margin">退款原因</p>
            </li>
            <li className="row col-xs-12 no-margin bottom-border refund-reason" onClick={this.showPopup}>
              <input className="col-xs-10" type="text" placeholder="请选择退货原因" value={this.state.reason} onChange={this.onVerifyCodeChange} />
              <i className="col-xs-2 no-padding icon-angle-down font-grey-light text-right"></i>
            </li>
            <li className="row col-xs-12 no-margin bottom-border refunds-desc">
              <textarea className="col-xs-12" type="text" placeholder="请输入退款说明" onChange={this.onDesciptionChange} />
            </li>
          </ul>
          <Popup className="popup" active={this.state.showPopup} height="auto">
            <div className="refunds-address-info">
              <p className="no-margin text-center bottom-border" data-reason-index="1" onClick={this.onReasonChange}>{reasons[1]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="2" onClick={this.onReasonChange}>{reasons[2]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="3" onClick={this.onReasonChange}>{reasons[3]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="4" onClick={this.onReasonChange}>{reasons[4]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="5" onClick={this.onReasonChange}>{reasons[5]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="6" onClick={this.onReasonChange}>{reasons[6]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="7" onClick={this.onReasonChange}>{reasons[7]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="8" onClick={this.onReasonChange}>{reasons[8]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="9" onClick={this.onReasonChange}>{reasons[9]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="10" onClick={this.onReasonChange}>{reasons[10]}</p>
              <p className="no-margin text-center bottom-border" data-reason-index="11" onClick={this.onReasonChange}>{reasons[0]}</p>
              <div className="row no-margin">
                <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.hidePopup}>取消</button>
              </div>
            </div>
          </Popup>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.onSubmitBtnClick}>提交</button>
          </div>
        </div>
      </div>
    );
  }
}
