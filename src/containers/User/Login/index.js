import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'underscore';
import classnames from 'classnames';
import * as actionCreators from 'actions/user/login';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';

import './index.scss';

@connect(
  state => ({
    data: state.login.data,
    isLoading: state.login.isLoading,
    error: state.login.error,
    success: state.login.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Login extends Component {
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
    switch (nextProps.data.rcode) {
      case 0:
        Toast.show(nextProps.data.msg);
        if (query.next && query.next.indexOf('http') >= 0) {
          window.location.href = query.next;
          return;
        }
        query.next ? router.replace(query.next) : router.replace('/');
        break;
      default:
        Toast.show(nextProps.data.msg);
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
    this.context.router.push('/user/register');
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
        <Header title="登录" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content has-header">
          <Input type="number" placeholder="请输入手机号" regex={/^0?1[3|4|5|7|8][0-9]\d{8}$/} onChange={this.onUsernameChange} />
          <Input type="password" placeholder="请输入登录密码" onChange={this.onPasswordChange} />
          <div className="row no-margin">
            <Link className="pull-right margin-right-xxs margin-top-xs dark-blue text-underliner" to="/user/password/reset" >忘记密码</Link>
          </div>
          <div className="row no-margin">
            <button className={loginBtnCls} type="button" onClick={this.onLoginBtnClick}>登录</button>
          </div>
          <div className="row no-margin">
            <button className={registerBtnCls} type="button" onClick={this.onRegisterClick}>注册</button>
          </div>
          <p className="row no-margin text-center hide">
            <span className="col-xs-4 bottom-border margin-top-lg height-19"></span>
            <span className="col-xs-4 margin-top-lg grey">第三方登录</span>
            <span className="col-xs-4 bottom-border margin-top-lg height-19"></span>
          </p>
          <div className="row no-margin hide">
            <div className="col-xs-8 col-xs-offset-2 text-center margin-top-sm">
              <i className="col-xs-6 icon-wechat icon-3x icon-green"></i>
              <i className="col-xs-6 icon-weibo icon-3x icon-green"></i>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
