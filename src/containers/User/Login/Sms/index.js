import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/user/verifyCode';
import { Header } from 'components/Header';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';

import './index.scss';

const requestAction = 'sms_login';

@connect(
  state => ({
    verifyCode: state.verifyCode,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Password extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.object,
    verifyCode: React.PropTypes.any,
    fetchVerifyCode: React.PropTypes.func,
    verify: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    getVerifyCodeBtnDsiabled: true,
    getVerifyCodeBtnPressed: false,
    nextBtnDisabled: true,
    nextBtnPressed: false,
    remaining: '获取验证码',
  }

  componentWillReceiveProps(nextProps) {
    const { query } = this.props.location;
    const { fetch, verify } = nextProps.verifyCode;
    if (verify.success && verify.data.rcode === 0 && !verify.isLoading) {
      Toast.show(verify.data.msg);
      this.context.router.replace(query.next);
    } else if (verify.success && !verify.isLoading) {
      Toast.show(verify.data.msg);
      this.setState({ nextBtnPressed: false });
    } else if ((verify.error) && !verify.isLoading) {
      Toast.show(verify.data.detail);
      this.setState({ nextBtnPressed: false });
    }
    if ((fetch.success || fetch.error) && !fetch.isLoading && !this.state.verifyCode) {
      Toast.show(fetch.data.msg);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onPhoneChange = (value) => {
    this.setState({
      getVerifyCodeBtnDsiabled: false,
      phone: value,
    });
  }

  onGetVerifyCodeBtnClick = (e) => {
    const { phone, action } = this.state;
    this.setState({ getVerifyCodeBtnPressed: true, getVerifyCodeBtnDsiabled: true, remaining: '60s' });
    this.props.fetchVerifyCode(phone, requestAction);

    this.tick();
    this.interval = setInterval(this.tick, 1000);

    _.delay(() => {
      this.setState({ getVerifyCodeBtnPressed: false });
    }, 50);
    _.delay(() => {
        this.setState({ getVerifyCodeBtnDsiabled: false });
      }, 60000);
    e.preventDefault();
  }

  onVerifyCodeChange = (e) => {
    this.setState({
      verifyCode: e.target.value,
      submitBtnDisabled: false,
    });
  }

  onNextBntClick = (e) => {
    const { phone, verifyCode, action } = this.state;
    if (!verifyCode) {
      return;
    }
    this.setState({ nextBtnPressed: true });
    this.props.verify(phone, verifyCode, requestAction);
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
    const props = this.props;
    const { action } = this.state;
    const getVerifyCodeBtnCls = classnames({
      ['button button-light button-sm verify-code-button']: 1,
      ['pressed']: this.state.getVerifyCodeBtnPressed,
    });
    const nextBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.nextBtnPressed,
    });
    return (
      <div className="login-sms">
        <Header title="验证码登录" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          <Input type="number" placeholder="请输入手机号" onChange={this.onPhoneChange}/>
          <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange}/>
            <button className={getVerifyCodeBtnCls} type="button" onClick={this.onGetVerifyCodeBtnClick} disabled={this.state.getVerifyCodeBtnDsiabled}>{this.state.remaining}</button>
          </div>
          <div className="row no-margin">
            <button className={nextBtnCls} type="button" onClick={this.onNextBntClick} disabled={this.state.nextBtnPressed}>登录</button>
          </div>
        </div>
      </div>
    );
  }
}
