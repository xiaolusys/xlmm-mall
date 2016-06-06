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
import { Timeline, TimelineItem } from 'components/Timeline';
import * as utils from 'utils';
import * as actionCreators from 'actions/refunds/apply';

import './index.scss';

const titles = {
  2: '申请退款',
  5: '申请退货',
};

@connect(
  state => ({
    data: state.refundsApply.data,
    isLoading: state.refundsApply.isLoading,
    error: state.refundsApply.error,
    success: state.refundsApply.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Apply extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    getOrderById: React.PropTypes.func,
    pushRefundsApply: React.PropTypes.func,
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
    this.props.getOrderById(params.tradeId, params.orderId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      this.setState({ num: nextProps.data.num || 0 });
    }
    // if (isLoading) {
    //   utils.ui.loadingSpinner.show();
    // } else {
    //   utils.ui.loadingSpinner.hide();
    // }
  }
  onSubmitBtnClick = (e) => {
    const { data } = this.props;
    const state = this.state;
    const params = {
      id: data.id,
      reason: state.reason,
      num: state.num,
      sum_price: data.sum_price,
      description: state.description,
      proof_pic: '',
    };
    this.props.pushRefundsApply(params);
    e.preventDefault();
  }

  onReasonChange = (e) => {
    const reason = e.target.textContent;
    this.setState({ reason: reason, showPopup: false });
    e.preventDefault();
  }

  onDesciptionChange = (e) => {
    this.setState({ description: e.target.value });
    e.preventDefault();
  }

  numMinus = (e) => {
    if (this.state.num) {
      this.setState({ num: this.state.num - 1 });
    }
    e.preventDefault();
  }

  numPlus = (e) => {
    if (this.state.num < this.props.data.num) {
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
    const { isLoading, data } = this.props;
    let statusList = [];
    if (!_.isEmpty(data.status_shaft)) {
      statusList = data.status_shaft.reverse();
    }
    return (
      <div className="refunds-apply">
        <Header title={titles[data.status] || ''} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content refunds">
          <ul className="refunds-apply-list">
            <li className="row col-xs-12 no-margin bottom-border">
              <div className="col-xs-3">
                <Image className="login-banner border" thumbnail={70} crop={70 + 'x' + 70} quality={100} src={data.pic_path}/>
              </div>
              <div className="col-xs-9 no-padding">
                <p className="row no-margin padding-top-xxs padding-bottom-xxs padding-left-xxs">
                  <span className="col-xs-9 no-wrap padding-left-xs">{data.title}</span>
                  <span className="col-xs-3 no-padding text-right">{'¥' + data.total_fee}</span>
                </p>
                <p className="row no-margin font-grey-light padding-left-xxs">
                  <span className="col-xs-9 padding-left-xs">尺码: {data.sku_name}</span>
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
              <p className="col-xs-8 no-margin no-padding text-right font-orange">{'¥' + data.payment}</p>
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
              <p className="no-margin text-center bottom-border" onClick={this.onReasonChange}>未收到货</p>
              <p className="no-margin text-center bottom-border" onClick={this.onReasonChange}>商品质量问题</p>
              <p className="no-margin text-center bottom-border" onClick={this.onReasonChange}>收到商品破损</p>
              <p className="no-margin text-center bottom-border" onClick={this.onReasonChange}>商品漏发/错发</p>
              <p className="no-margin text-center bottom-border" onClick={this.onReasonChange}>其他原因</p>
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
