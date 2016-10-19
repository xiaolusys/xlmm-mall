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
        Toast.show('提现成功');
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
      this.setState({ getVerifyCodeBtnDisabled: false });
      if (nextProps.userCashout.cashoutVerifyCode.success && nextProps.userCashout.cashoutVerifyCode.data) {
        Toast.show(nextProps.userCashout.cashoutVerifyCode.data.info);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onCheckboxChange = (e) => {
    const { cash } = this.props.location.query;
    this.setState({ checked: !this.state.checked });
    if (this.state.checked) {
      this.setState({ cashoutValue: '' });
      e.preventDefault();
      return;
    }
    if (cash > 0) {
      if (Math.round(cash * 100) > 20000) {
        this.setState({ cashoutValue: 200 });
      } else {
        this.setState({ cashoutValue: cash });
      }
    }
    e.preventDefault();
  }

  onCashoutValueChange = (e) => {
    console.log(e.target);
    this.setState({ cashoutValue: e.target.value });
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
    const { cashoutValue, verifyCode } = this.state;
    if (!verifyCode || (cashoutValue === '') || (cashoutValue <= 0) || (cashoutValue > 200)) {
      Toast.show('金额或验证码为空，请重新输入！！！');
      return;
    }

    this.setState({ submitBtnDisabled: true });
    console.log('cash ' + cashoutValue + ' ' + verifyCode);
    this.props.cashout(cashoutValue, verifyCode);
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
    const { cash, nick } = this.props.location.query;
    const hasHeader = !utils.detector.isApp();
    const { cashoutPolicy } = this.props.userCashout;

    return (
      <div>
        <Header title="提现 " leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content cashout-container no-padding">
          <div className={'cash row'}>
            <p className=" col-xs-6 font-xs"><span>我的零钱:</span><span>{cash}</span></p>
            <Checkbox className="col-xs-4 font-xs" checked={this.state.checked} onChange={this.onCheckboxChange}>最大提现</Checkbox>
          </div>
          <div className={'cash row bottom-border'}>
            <p className=" col-xs-4 font-xs">金额（元）:</p>
            <input className="col-xs-6 font-xs" type="number" placeholder="请输入提现金额" onChange={this.onCashoutValueChange} value={this.state.cashoutValue}></input>
          </div>
          <div className={'cash-nick row'}>
            <p className=" col-xs-6 font-xs">提现至微信红包</p>
            <p className=" col-xs-offset-2 col-xs-4 font-xs">{nick}</p>
          </div>
          <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8 font-xs" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} />
            <button className="button button-light button-sm verify-code-button font-xs" type="button" onClick={this.onGetVerifyCodeBtnClick} disabled={this.state.getVerifyCodeBtnDisabled}>{this.state.remaining}</button>
          </div>
          <div className={'cash-message'}>
            <p className=" font-xs">{cashoutPolicy.data.message}</p>
          </div>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.onSubmitBtnClick} disabled={this.state.submitBtnDisabled}>提交</button>
          </div>
        </div>
      </div>
    );
  }
}
