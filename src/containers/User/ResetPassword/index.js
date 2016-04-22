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

export default class ResetPassword extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    getVerifyCodeBtnDisabled: true,
    resetPasswordBtnDisabled: true,
  }

  componentWillReceiveProps(nextProps) {

  }

  onPhoneChange = (value) => {

  }

  onVerifyCodeChange = (e) => {

  }

  onGetVerifyCodeBtnClick = (e) => {

  }

  onResetPasswordBtnClick = (e) => {

  }


  render() {
    const props = this.props;
    const getVerifyCodeBtnCls = classnames({
      ['button button-light button-sm verify-code-button']: 1,
      ['pressed']: this.state.getVerifyCodeBtnPressed,
    });
    const resetPasswordBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.nextBtnPressed,
    });
    return (
      <div>
        <Header title="重置密码" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header">
          <Input type="number" placeholder="请输入手机号" onChange={this.onPhoneChange}/>
          <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} />
            <button className={getVerifyCodeBtnCls} type="button" onClick={this.onGetVerifyCodeBtnClick} disabled={this.state.getVerifyCodeBtnDisabled}>获取验证码</button>
          </div>
          <div className="margin-top-xs">
            <Input type="number" placeholder="请输入登录密码" onChange={this}/>
            <Input type="number" placeholder="请确认登录密码" onChange={this}/>
          </div>
          <div className="row no-margin">
            <button className={resetPasswordBtnCls} type="button" onClick={this.onResetPasswordBtnClick} disabled={this.state.resetPasswordBtnDisabled}>重置密码</button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
