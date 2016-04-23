import React, { Component } from 'react';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';
import * as actionCreators from 'actions/user/verifyCode';
import './index.scss';

export default class Phone extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
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

  componentWillMount() {

  }

  onGetVerifyCodeBtnClick = (e) => {

  }

  onBubmitBtnClick = (e) => {

  }

  onUserPhoneChange = (value) => {
    this.setState({ phone: value });
  }

  onVertifyCodeChange = (value) => {
    this.setState({ verifyCode: value });
  }

  render() {
    const props = this.props;
    const { children, data, isLoading, error } = this.props;
    const getVerifyCodeBtnCls = classnames({
      ['button button-light button-sm verify-code-button']: 1,
    });
    const bindPhoneBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
    });
    return (
      <div>
        <Header title="手机绑定" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="has-header content">
        <Input placeholder={'请输入手机号码'} onChange={this.onUserPhoneChange}/>
        <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8" type="number" placeholder="请输入验证码" onChange={this.onVertifyCodeChange} />
            <button className={getVerifyCodeBtnCls} type="button" onClick={this.onGetVerifyCodeBtnClick}>获取验证码</button>
        </div>
        <div className="row no-margin">
            <button className={bindPhoneBtnCls} type="button" onClick={this.onBubmitBtnClick}>提交</button>
        </div>
        <Footer/>
        </div>
      </div>
    );
  }
}
