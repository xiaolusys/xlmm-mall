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

  render() {
    const props = this.props;
    return (
      <div>
        <Header title="登录" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header">
          <Input type="number" placeholder="请输入手机号" />
          <Input type="password" placeholder="请输入登录密码" />
          <div className="row no-margin">
            <a className="pull-right margin-top-xs" href="/#/password/reset" >忘记密码？</a>
          </div>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" >登录</button>
          </div>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-stable" type="button" >注册</button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
