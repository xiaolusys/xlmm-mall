import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import * as actionCreators from 'actions/refunds/expressInfo';

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
    pushExpressInfo: React.PropTypes.func,
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.expressInfo.success) {
      Toast.show(nextProps.expressInfo.data.msg);
    }
    if (nextProps.expressInfo.success && nextProps.expressInfo.data.code === 0) {
      this.context.router.push('/refunds/details/' + this.props.params.id);
    }
  }

  onBubmitBtnClick = (e) => {
    const props = this.props;
    const params = { company: props.params.name, id: props.params.id, modify: 2, sid: this.state.logisticsNUmber };
    this.props.pushExpressInfo(params);
    e.preventDefault();
  }
  onLogisticsNumberChange = (e) => {
    this.setState({
      logisticsNUmber: e.currentTarget.value,
      submitBtnDisabled: false,
    });
    e.preventDefault();
  }

  render() {
    const bindPhoneBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.submitBtnPressed,
    });
    const props = this.props;
    return (
      <div className="fill-logistics-info">
        <Header title="填写快递单" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content">
          <div className="row express-item refunds-address border">
            <p className="text-center font-xlg font-weight-800 margin-top-xs">收货地址</p>
            <div className="bottom-border">
              <p className="text-left no-margin">
                <span className="margin-right-xs">收货人：小鹿售后</span>
                <span>联系电话：021-50939326</span>
              </p>
              <p className="no-margin font-grey-light">上海市松江区佘山镇吉业路245号5号楼</p>
            </div>
            <div>
              <p>为提高您的退货退款效率，请注意一下事项</p>
              <p>1.填写退货单or小纸条一并寄回，写明您的<span className="font-orange">微信昵称、联系电话、退换货原因</span></p>
              <p>2.勿发顺丰或EMS高等邮费快递</p>
              <p>3.请先支付邮费，拒收到付件。收货验收后，货款和运费将分开退还到您的相应帐户</p>
              <p>4.请保持衣服吊牌完整，不影响商品后续处理</p>
            </div>
          </div>
          <div className="row no-margin bottom-border express-item">
            <Link to={ '/refunds/expressCompany/' + props.params.id } className="no-margin">
              <p className="col-xs-6 no-margin">{props.params.name}</p>
              <i className="col-xs-6 icon-angle-right font-grey-light text-right"></i>
            </Link>
          </div>
          <div className="row no-margin bottom-border express-item">
            <input className="col-xs-12 info-item" type="text" placeholder={'请输入快递单号'} onChange={this.onLogisticsNumberChange} />
          </div>
          <div className="row no-margin">
            <button className={bindPhoneBtnCls} type="button" onClick={this.onBubmitBtnClick} disabled={this.state.submitBtnDisabled}>提交</button>
          </div>
        </div>
      </div>
    );
  }
}
