import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import * as actionCreators from 'actions/user/login';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';

@connect(
  state => ({
    data: state.login.data,
    isLoading: state.login.isLoading,
    error: state.login.error,
    success: state.login.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class Login extends Component {
  static propTypes = {

    dispatch: React.PropTypes.func,
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    login: React.PropTypes.func,
    location: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    loginBtnPressed: false,
    registerBtnPressed: false,
  }

  componentWillReceiveProps(nextProps) {
    const { router } = this.context;
    const { query } = this.props.location;
    if (!nextProps.success) {
      return;
    }
    switch (nextProps.data.code) {
      case 0:
        query.next ? router.push(query.next) : router.push('/');
        break;
      case 1:
        break;
      case 2:
        Toast.show('密码错误');
        break;
      case 3:
        Toast.show('没有注册');
        break;
      case 4:
        Toast.show('账号异常');
        break;
      case 6:
        Toast.show('系统异常');
        break;
      default:
        break;
    }
  }

  onLoginBtnClick = (e) => {
    this.setState({ loginBtnPressed: true });
    this.props.login(this.state.username, this.state.password);
    _.delay(() => {
      this.setState({ loginBtnPressed: false });
    }, 50);
    e.preventDefault();
  }

  onRegisterClick = (e) => {
    this.setState({ loginBtnPressed: true });
    this.context.router.push('/register');
    e.preventDefault();
  }

  onUsernameChange = (value) => {
    this.setState({ username: value });
  }

  onPasswordChange = (value) => {
    this.setState({ password: value });
  }

  render() {
    const props = this.props;
    const loginBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.loginBtnPressed,
    });
    const registerBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-stable']: 1,
      ['pressed']: this.state.registerBtnPressed,
    });
    return (
      <div>
        <Header title="登录" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header">
          <Input type="number" placeholder="请输入手机号" regex={/^0?1[3|4|5|7|8][0-9]\d{8}$/} onChange={this.onUsernameChange} />
          <Input type="password" placeholder="请输入登录密码" onChange={this.onPasswordChange} />
          <div className="row no-margin">
            <a className="pull-right margin-top-xs" href="/#/password/reset" >忘记密码？</a>
          </div>
          <div className="row no-margin">
            <button className={loginBtnCls} type="button" onClick={this.onLoginBtnClick}>登录</button>
          </div>
          <div className="row no-margin">
            <button className={registerBtnCls} type="button" onClick={this.onRegisterClick}>注册</button>
          </div>
          <div className="row no-margin text-center">
            <p className="margin-top-md">第三方登录</p>
          </div>
          <div className="row no-margin">
            <div className="col-xs-8 col-xs-offset-2 text-center">
              <i className="col-xs-6 icon-wechat icon-2x"></i>
              <i className="col-xs-6 icon-weibo icon-2x"></i>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
