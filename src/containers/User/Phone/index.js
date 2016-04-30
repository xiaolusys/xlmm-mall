import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';
import * as actionCreators from 'actions/user/password';
import { Toast } from 'components/Toast';

import './index.scss';

@connect(
  state => ({
    data: state.password.data,
    isLoading: state.password.isLoading,
    error: state.password.error,
    success: state.password.success,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class Phone extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchVerifyCode: React.PropTypes.func,
    verify: React.PropTypes.func,
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
    submitBtnDisabled: true,
    submitBtnPressed: false,
    bindPhone: false,
  }

  componentWillMount() {
    this.setState({ action: { requestAction: 'bind' } });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success) {
      Toast.show(nextProps.data.msg);
    }
    if (nextProps.success && nextProps.data.rcode === 0 && this.state.bindPhone) {
      this.context.router.push('/user/profile');
    }
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

  onBubmitBtnClick = (e) => {
    const { phone, verifyCode, action } = this.state;
    if (!verifyCode) {
      return;
    }
    this.setState({ bindPhone: true });
    this.setState({ submitBtnPressed: true });
    this.props.verify(phone, verifyCode, action.requestAction);
    _.delay(() => {
      this.setState({ submitBtnPressed: false });
    }, 50);
  }

  onPhoneChange = (value) => {
    this.setState({
      phone: value,
      getVerifyCodeBtnDsiabled: false,
    });
  }

  onVerifyCodeChange = (e) => {
    this.setState({
      verifyCode: e.target.value,
      submitBtnDisabled: false,
    });
  }

  render() {
    const props = this.props;
    const { children, data, isLoading, error } = this.props;
    const getVerifyCodeBtnCls = classnames({
      ['button button-light button-sm verify-code-button']: 1,
      ['pressed']: this.state.getVerifyCodeBtnPressed,
    });
    const bindPhoneBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
      ['pressed']: this.state.submitBtnPressed,
    });
    return (
      <div>
        <Header title="手机绑定" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="has-header content">
          <Input type="number" placeholder={'请输入手机号码'} onChange={this.onPhoneChange} />
          <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} />
            <button className={getVerifyCodeBtnCls} type="button" onClick={this.onGetVerifyCodeBtnClick} disabled={this.state.getVerifyCodeBtnDsiabled}>获取验证码</button>
          </div>
          <div className="row no-margin">
            <button className={bindPhoneBtnCls} type="button" onClick={this.onBubmitBtnClick} disabled={this.state.submitBtnDisabled}>提交</button>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}
