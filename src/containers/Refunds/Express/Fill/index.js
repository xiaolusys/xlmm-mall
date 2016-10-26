import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Timeline, TimelineItem } from 'components/Timeline';
import * as expressInfoAction from 'actions/refunds/expressInfo';
import * as refundsDetailsAction from 'actions/refunds/detail';

import './index.scss';

const actionCreators = _.extend(expressInfoAction, refundsDetailsAction);

@connect(
  state => ({
    express: state.expressInfo,
    refundsDetails: state.refundsDetails,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Fill extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    children: React.PropTypes.array,
    params: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    error: React.PropTypes.bool,
    refundsDetails: React.PropTypes.object,
    express: React.PropTypes.object,
    fetchRefundsDetail: React.PropTypes.func,
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

  componentWillMount() {
    const { refundsid } = this.props.params;
    if (_.isEmpty(this.props.refundsDetails.data)) {
      this.props.fetchRefundsDetail(refundsid);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { express } = nextProps;
    if (express.success) {
      Toast.show(express.data.info);
    }
    if (express.success && express.data.code === 0) {
      this.context.router.push('/refunds/details/' + this.props.params.refundsid);
    }
  }

  onSubmitBtnClick = (e) => {
    const props = this.props;
    const params = { company: props.params.name, id: props.params.orderid, modify: 2, sid: this.state.logisticsNUmber };
    this.props.pushExpressInfo(params);
    e.preventDefault();
  }

  onExpressChooseBtnClick = (e) => {
    const { refundsid, orderid } = this.props.params;
    this.context.router.replace(`/refunds/express/company/${refundsid}/${orderid}`);
  }

  onLogisticsNumberChange = (e) => {
    this.setState({
      logisticsNUmber: e.currentTarget.value,
      submitBtnDisabled: false,
    });
    e.preventDefault();
  }

  render() {
    const { type, packageId, companyName } = this.props.location.query;
    const bindPhoneBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.submitBtnPressed,
    });
    const { refundsDetails, params } = this.props;
    const refundsDetailsData = refundsDetails.data || {};
    return (
      <div className="fill-logistics-info">
        <Header title="填写快递单" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
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
              <p>为提高您的退货退款效率，请注意以下事项</p>
              <p>1.填写退货单or小纸条一并寄回，写明您的<span className="font-orange">微信昵称、联系电话、退换货原因</span>，请务必在本申请里填写退货物流信息，以方便我们快速给您退款</p>
              <p>2.勿发顺丰或EMS高等邮费快递</p>
              <p>3.质量问题退货请事先拍照并联系在线客服，客服审核通过后会包邮退。但请您先支付邮费，仓库拒收到付件。收货验收后，货款和运费将分开退还到您的相应帐户</p>
              <p>4.请保持衣服吊牌完整，不影响商品后续处理</p>
            </div>
          </div>
          <div className="row no-margin bottom-border express-item">
            <div className="select-express" onClick={this.onExpressChooseBtnClick}>
              <p className="col-xs-6 no-margin">{params.name}</p>
              <i className="col-xs-6 icon-angle-right font-grey-light text-right"></i>
            </div>
          </div>
          <div className="row no-margin bottom-border express-item">
            <input className="col-xs-12 info-item" type="text" placeholder={'请输入快递单号'} onChange={this.onLogisticsNumberChange} />
          </div>
          <div className="row no-margin">
            <button className={bindPhoneBtnCls} type="button" onClick={this.onSubmitBtnClick} disabled={this.state.submitBtnDisabled}>提交</button>
          </div>
        </div>
      </div>
    );
  }
}
