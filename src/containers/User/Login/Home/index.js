import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as constants from 'constants';
import * as utils from 'utils';
import classnames from 'classnames';
import * as actionCreators from 'actions/user/login';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';

import loginSplash from './images/login-splash.jpg';

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
export default class Home extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    trasparent: React.PropTypes.boolean,
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

  static defaultProps = {
    prefixCls: 'login-home',
    trasparent: true,
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

  onWechatLoginBtnClick = (e) => {
    window.location.replace(constants.baseEndpointV1 + 'users/weixin_login/?next=' + encodeURIComponent(this.next()));
    e.preventDefault();
  }

  render() {
    const { prefixCls, trasparent } = this.props;
    return (
      <div className={`${prefixCls}`}>
        <Header trasparent={`${trasparent}`} title="登录" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          <img className="login-banner" src={loginSplash}/>
          <If condition= {utils.detector.isWechat()}>
            <div className="row no-margin">
              <button className="col-xs-10 col-xs-offset-1 margin-top-sm button button-no-padding button-success" type="button" onClick={this.onRegisterClick}>
                <i className="icon-wechat" data-type={loginType.wechat} onClick={this.onWechatLoginBtnClick}></i>
                <span>微信登录</span>
              </button>
            </div>
          </If>
          <div className="row no-margin margin-bottom-sm">
            <Link className="col-xs-4 col-xs-offset-1 button button-stable text-center login-mobile" to="/user/login/password">密码登录</Link>
            <Link className="col-xs-4 col-xs-offset-2 button button-stable text-center login-sms" to="/user/login/sms">验证码登录</Link>
          </div>
          <div className="row no-margin  padding-top-xs user-register">
            <Link className="col-xs-10 col-xs-offset-1 button-stable text-center font-grey-light" to="/user/register">注册新用户</Link>
          </div>
        </div>
      </div>
    );
  }
}
