import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'underscore';
import * as constants from 'constants';
import * as utils from 'utils';
import classnames from 'classnames';
import * as actionCreators from 'actions/user/login';
import { Header } from 'components/Header';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';

import './index.scss';

const loginType = {
  password: 0,
  wechat: 1,
};

@connect(
  state => ({
    data: state.login.data,
    isLoading: state.login.isLoading,
    error: state.login.error,
    success: state.login.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Password extends Component {
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

  state = {}

  componentWillReceiveProps(nextProps) {
    const { router } = this.context;
    const { query } = this.props.location;
    if (!nextProps.success) {
      return;
    }
    switch (nextProps.data.rcode) {
      case 0:
        Toast.show(nextProps.data.msg);
        window.location.replace(this.next());
        break;
      default:
        Toast.show(nextProps.data.msg);
        break;
    }
  }

  onLoginBtnClick = (e) => {
    const type = Number(e.currentTarget.dataset.type);
    switch (type) {
      case loginType.password:
        this.props.login(this.state.username, this.state.password);
        break;
      case loginType.wechat:
        window.location.replace(constants.baseEndpointV1 + 'users/weixin_login/?next=' + encodeURIComponent(this.next()));
        break;
      default:
        break;
    }
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

  next = () => {
    const { query } = this.props.location;
    if (query.next && query.next.indexOf('http') >= 0) {
      return query.next;
    }
    return query.next ? utils.url.getBaseUrl() + query.next : utils.url.getBaseUrl();
  }

  render() {
    const props = this.props;
    return (
      <div>
        <Header title="密码登录" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content login">
          <Input type="number" placeholder="请输入手机号" regex={/^0?1[3|4|5|7|8][0-9]\d{8}$/} onChange={this.onUsernameChange} />
          <Input type="password" placeholder="请输入登录密码" onChange={this.onPasswordChange} />
          <div className="row no-margin">
            <Link className="pull-right margin-right-xxs margin-top-xs dark-blue text-underliner" to="/user/password/reset" >忘记密码</Link>
          </div>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" data-type={loginType.password} onClick={this.onLoginBtnClick}>登录</button>
          </div>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-stable" type="button" onClick={this.onRegisterClick}>注册</button>
          </div>
          <If condition= {utils.detector.isWechat()}>
            <p className="row no-margin text-center">
              <span className="col-xs-4 bottom-border margin-top-lg height-19"></span>
              <span className="col-xs-4 margin-top-lg grey">第三方登录</span>
              <span className="col-xs-4 bottom-border margin-top-lg height-19"></span>
            </p>
            <div className="row no-margin">
              <div className="col-xs-8 col-xs-offset-2 text-center margin-top-sm">
                <i className="icon-wechat icon-3x icon-green" data-type={loginType.wechat} onClick={this.onLoginBtnClick}></i>
              </div>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
