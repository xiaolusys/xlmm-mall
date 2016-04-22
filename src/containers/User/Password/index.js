import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/user/password';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';

import './index.scss';

const passwordAction = {
  '/user/register': {
    title: '注册',
    nextBtnTitle: '注册',
    requestAction: 'register',
  },
  '/user/password/reset': {
    title: '重置密码',
    nextBtnTitle: '重置密码',
    requestAction: 'find_pwd',
  },
  '/user/password/set': {
    title: '修改密码',
    nextBtnTitle: '修改密码',
    requestAction: 'change_pwd',
  },
};

@connect(
  state => ({
    data: state.password.data,
    isLoading: state.password.isLoading,
    error: state.password.error,
    success: state.password.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Password extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.object,
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchVerifyCode: React.PropTypes.func,
    verify: React.PropTypes.func,
    setPassword: React.PropTypes.func,
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
    setPassword: false,
  }

  componentWillMount() {
    this.setState({ action: passwordAction[this.props.location.pathname] });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      Toast.show(nextProps.data.msg);
    }
    if (nextProps.success && nextProps.data.rcode === 0 && this.state.setPassword) {
      this.context.router.push('/user/login');
    }
  }

  onPhoneChange = (value) => {
    this.setState({
      getVerifyCodeBtnDsiabled: false,
      phone: value,
    });
  }

  onGetVerifyCodeBtnClick = (e) => {
    const { phone, action } = this.state;
    this.setState({ getVerifyCodeBtnPressed: true });
    this.props.fetchVerifyCode(phone, action.requestAction);
    _.delay(() => {
      this.setState({ getVerifyCodeBtnPressed: false });
    }, 50);
    e.preventDefault();
  }

  onVerifyCodeChange = (e) => {
    this.setState({
      verifyCode: e.target.value,
    });
  }

  onVerifyCodeBlur = (e) => {
    const { phone, verifyCode, action } = this.state;
    if (!verifyCode) {
      return;
    }
    this.props.verify(phone, verifyCode, action.requestAction);
  }

  onPasswordChange = (value) => {
    this.setState({ password: value });
  }

  onPasswordRepeatChange = (value) => {
    this.setState({ repeatedPassword: value });
  }

  onNextBntClick = (e) => {
    const { phone, verifyCode, password, repeatedPassword } = this.state;
    this.setState({ setPassword: true });
    this.props.setPassword(phone, verifyCode, password, repeatedPassword);
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
      <div>
        <Header title={action.title} leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header">
          <Input type="number" placeholder="请输入手机号" onChange={this.onPhoneChange}/>
          <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} onBlur= {this.onVerifyCodeBlur} />
            <button className={getVerifyCodeBtnCls} type="button" onClick={this.onGetVerifyCodeBtnClick} disabled={this.state.getVerifyCodeBtnDsiabled}>获取验证码</button>
          </div>
          <div className="margin-top-xs">
            <Input type="password" placeholder="请输入登录密码" onChange={this.onPasswordChange}/>
            <Input type="password" placeholder="请确认登录密码" onChange={this.onPasswordRepeatChange}/>
          </div>
          <div className="row no-margin">
            <button className={nextBtnCls} type="button" onClick={this.onNextBntClick} disabled={this.state.nextBtnPressed}>{action.nextBtnTitle}</button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
