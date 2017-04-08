import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';

import { Image } from 'components/Image';
import { Product } from 'components/Product';
import { Loader } from 'components/Loader';
import { Toast } from 'components/Toast';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';
import * as actionCreators from 'actions/user/userCashout';

import './index.scss';

@connect(
  state => ({
    userCashout: state.userCashout,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Cashout extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    params: React.PropTypes.any,
    userCashout: React.PropTypes.any,
    cashout: React.PropTypes.func,
    fetchCashoutPolicy: React.PropTypes.func,
    reqCashoutVerifyCode: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    cashoutValue: '',
    cashoutName: '',
    checked: false,
    getVerifyCodeBtnDisabled: false,
    submitBtnDisabled: false,
    remaining: '获取验证码',
  }

  componentWillMount() {
    this.props.fetchCashoutPolicy();
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userCashout.cashout.isLoading) {
      this.setState({ submitBtnDisabled: false });
      if (nextProps.userCashout.cashout.success && nextProps.userCashout.cashout.data.code === 0) {
        Toast.show('提现申请成功');
        this.context.router.goBack();
      }

      if (nextProps.userCashout.cashout.success && nextProps.userCashout.cashout.data.code !== 0) {
        Toast.show(nextProps.userCashout.cashout.data.message);
      }

      if (nextProps.userCashout.cashout.error) {
        Toast.show('网络错误');
      }
    }

    if (this.props.userCashout.cashoutVerifyCode.isLoading) {
      if (nextProps.userCashout.cashoutVerifyCode.success && nextProps.userCashout.cashoutVerifyCode.data) {
        Toast.show(nextProps.userCashout.cashoutVerifyCode.data.info);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onCheckboxChange = (e) => {
    const { cash, isPartner } = this.props.location.query;
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({ cashoutValue: '' });
      e.preventDefault();
      return;
    }
    if (cash > 0) {
      if (Math.round(cash * 100) > 20000 && Number(isPartner) === 0) {
        this.setState({ cashoutValue: 200 });
      } else if (Math.round(cash * 100) > 250000 && Number(isPartner) === 1) {
        this.setState({ cashoutValue: 2500 });
      } else {
        this.setState({ cashoutValue: cash });
      }
    }
    e.preventDefault();
  }

  onCashoutValueChange = (e) => {
    const { cash, isPartner } = this.props.location.query;
    if (cash <= 0 || (Math.round(e.target.value * 100) > Math.round(cash * 100))) {
      Toast.show('零钱金额不足，不能满足您输入的提现金额');
    } else {
      if (Math.round(e.target.value * 100) > 20000 && Number(isPartner) === 0) {
        this.setState({ cashoutValue: 200 });
        Toast.show('您的提现金额超过每次最大提现金额200，自动变为200');
      } else if (Math.round(e.target.value * 100) > 250000 && Number(isPartner) === 1) {
        this.setState({ cashoutValue: 2500 });
        Toast.show('您的提现金额超过每次最大提现金额2500，自动变为2500');
      } else {
        this.setState({ cashoutValue: e.target.value });
      }
    }
    e.preventDefault();
  }

  onCashoutNameChange = (e) => {
    this.setState({ cashoutName: e.target.value });
    e.preventDefault();
  }

  onGetVerifyCodeBtnClick = (e) => {
    const { phone, action } = this.state;
    if (!this.state.getVerifyCodeBtnDisabled) {
      this.setState({ getVerifyCodeBtnDisabled: true, remaining: '60s' });
      this.props.reqCashoutVerifyCode();

      this.tick();
      this.interval = setInterval(this.tick, 1000);

      _.delay(() => {
        this.setState({ getVerifyCodeBtnDisabled: false });
      }, 60000);
    }
    e.preventDefault();
  }

  onSubmitBtnClick = (e) => {
    const { cashoutValue, verifyCode, cashoutName } = this.state;
    const { isPartner } = this.props.location.query;
    let channel = 'wx';
    if (!verifyCode || (cashoutValue === '') || (cashoutValue <= 0)) {
      Toast.show('金额或验证码为空，请重新输入！！！');
      return;
    }

    if (cashoutValue > 200) {
      channel = 'wx_transfer';
    }

    if (Number(isPartner) === 1 && (cashoutName === '' || cashoutName === undefined)) {
      Toast.show('大额提现时收款人姓名不能为空，必须要跟微信绑定银行卡所有人姓名一致，请重新输入！！！');
      return;
    }

    this.setState({ submitBtnDisabled: true });
    console.log('cash ' + cashoutValue + ' ' + verifyCode, channel, cashoutName);
    this.props.cashout(cashoutValue, verifyCode, channel, cashoutName);
  }

  onVerifyCodeChange = (e) => {
    this.setState({
      verifyCode: e.target.value,
      submitBtnDisabled: false,
    });
  }

  tick = () => {
    let remaining = parseInt(this.state.remaining, 10);
    if (remaining > 0) {
      remaining--;
    } else if (remaining === 0) {
      remaining = 0;
    } else {
      remaining = 60;
    }
    if (remaining > 0) {
      this.setState({ remaining: remaining + 's' });
    } else {
      this.setState({ remaining: '获取验证码' });
      clearInterval(this.interval);
    }
  }

  render() {
    const { cash, nick, isPartner } = this.props.location.query;
    const hasHeader = !utils.detector.isApp();
    const { cashoutPolicy } = this.props.userCashout;

    return (
      <div>
        <Header title="提现 " leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content cashout-container no-padding">
          <div className={'cash row'}>
            <p className=" col-xs-6 font-xs"><span>我的零钱:</span><span>{cash}</span></p>
            <Checkbox className="col-xs-4 font-xs " checked={this.state.checked} onChange={this.onCheckboxChange}> 最大提现</Checkbox>
          </div>
          <div className={'cash row bottom-border'}>
            <p className=" col-xs-4 font-xs">金额（元）:</p>
            <input className="col-xs-6 font-xs cash-input" type="number" placeholder="请输入提现金额" onChange={this.onCashoutValueChange} value={this.state.cashoutValue}></input>
          </div>
          <If condition={Number(isPartner) > 0 && this.state.cashoutValue > 200 }>
            <div className={'cash row bottom-border'}>
              <p className=" col-xs-4 font-xs">收款人:</p>
              <input className="col-xs-7 font-xs cash-input" placeholder="请输入微信绑定的银行卡所有人的姓名" onChange={this.onCashoutNameChange} value={this.state.cashoutName}></input>
            </div>
          </If>
          <div className={'cash-nick'}>
            <i className="pull-left icon-1x icon-wechat-pay font-green"></i>
            <p className=" col-xs-5 font-xs">提现至微信红包</p>
            <p className=" col-xs-offset-2 col-xs-4 font-xs">{nick}</p>
          </div>
          <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8 font-xs" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} />
            <button className="button button-light button-sm verify-code-button font-xs" type="button" onClick={this.onGetVerifyCodeBtnClick} disabled={this.state.getVerifyCodeBtnDisabled}>{this.state.remaining}</button>
          </div>
          <div className={'cash-message'}>
            <p className=" font-xs">{cashoutPolicy.data.message}</p>
            <If condition={Number(isPartner) > 0}>
              <p className=" font-xs font-red">{'合伙人可以使用大额提现功能一次提现不超过2500元，审核通过后金额由微信直接转入微信-我的钱包账户。大额提现微信必须绑定银行卡并且填写的提现收款人和银行卡所有人姓名一致。'}</p>
            </If>
          </div>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.onSubmitBtnClick} disabled={this.state.submitBtnDisabled}>提交</button>
          </div>
        </div>
      </div>
    );
  }
}
