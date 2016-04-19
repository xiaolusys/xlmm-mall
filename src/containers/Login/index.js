import React, { Component } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';

export class Login extends Component {
  static propTypes = {
    children: React.PropTypes.any,
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

  onLoginBtnClick = (e) => {

  }

  render() {
    const props = this.props;
    return (
      <div>
        <Header title="登录" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header">
          <Input type="number" placeholder="请输入手机号" reuquired regex={/^0?1[3|4|5|7|8][0-9]\d{8}$/} />
          <Input type="password" placeholder="请输入登录密码" />
          <div className="row no-margin">
            <a className="pull-right margin-top-xs" href="/#/password/reset" >忘记密码？</a>
          </div>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.onLoginBtnClick}>登录</button>
          </div>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-stable" type="button" >注册</button>
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
