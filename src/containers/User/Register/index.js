import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/user/verifyCode';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';

import './index.scss';

const requestAction = 'register';

@connect(
  state => ({
    data: state.verifyCode.data,
    isLoading: state.verifyCode.isLoading,
    error: state.verifyCode.error,
    success: state.verifyCode.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Register extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      Toast.show(nextProps.data.msg);
    }
  }

  onPhoneChange = (value) => {
    this.setState({
      getVerifyCodeBtnDsiabled: false,
      phone: value,
    });
  }

  onGetVerifyCodeBtnClick = (e) => {

    this.setState({ getVerifyCodeBtnPressed: true });
    this.props.fetchVerifyCode(this.state.phone, requestAction);
    _.delay(() => {
      this.setState({ getVerifyCodeBtnPressed: false });
    }, 50);
    e.preventDefault();
  }

  onVerifyCodeChange = (e) => {
    this.setState({
      nextBtnDisabled: false,
      verifyCode: e.target.value,
    });
  }

  noRegisterBtnClick = (e) => {
    this.props.verify(this.state.phone, this.state.verifyCode, requestAction);
  }

  render() {
    const props = this.props;
    const getVerifyCodeBtnCls = classnames({
      ['button button-light button-sm verify-code-button']: 1,
      ['pressed']: this.state.getVerifyCodeBtnPressed,
    });
    const registerBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.nextBtnPressed,
    });
    return (
      <div>
        <Header title="注册" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header">
          <Input type="number" placeholder="请输入手机号" onChange={this.onPhoneChange}/>
          <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} />
            <button className={getVerifyCodeBtnCls} type="button" onClick={this.onGetVerifyCodeBtnClick} disabled={this.state.getVerifyCodeBtnDsiabled}>获取验证码</button>
          </div>
          <div className="margin-top-xs">
            <Input type="number" placeholder="请输入登录密码" onChange={this.onPasswordChange}/>
            <Input type="number" placeholder="请确认登录密码" onChange={this.onPasswordRepeatChange}/>
          </div>
          <div className="row no-margin">
            <button className={registerBtnCls} type="button" onClick={this.noRegisterBtnClick} disabled={this.state.registerBtnCls}>注册</button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
