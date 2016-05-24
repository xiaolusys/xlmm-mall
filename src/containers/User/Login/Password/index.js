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

  state = {

  }

  componentWillReceiveProps(nextProps) {
    const { query } = this.props.location;
    if (nextProps.success && !nextProps.isLoading) {
      Toast.show(nextProps.data.msg);
      if (nextProps.data.rcode === 0) {
        this.context.router.replace(query.next);
      }
    } else if (nextProps.error && !nextProps.isLoading) {
      Toast.show(nextProps.data.msg);
    }
  }

  onLoginBtnClick = (e) => {
    const type = Number(e.currentTarget.dataset.type);
    this.props.login(this.state.username, this.state.password);
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
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.onLoginBtnClick}>登录</button>
          </div>
        </div>
      </div>
    );
  }
}
