import React, { Component } from 'react';
import classnames from 'classnames';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Input } from 'components/Input';
import * as actionCreators from 'actions/user/verifyCode';
import { Toast } from 'components/Toast';

const dataFlowType = {
  init: 0,
  gettingVerifyCode: 1,
  gettedVerifyCode: 2,
  verifyingCode: 3,
  verifiedCode: 4,
};

@connect(
  state => ({
    data: state.verifyCode.verify.data,
    isLoading: state.verifyCode.verify.isLoading,
    error: state.verifyCode.verify.error,
    success: state.verifyCode.verify.success,
    verifyCodeData: state.verifyCode.fetch,
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
    verifyCodeData: React.PropTypes.any,
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
    dataFlowState: dataFlowType.init,
    remaining: '获取验证码',
  }

  componentWillMount() {
    this.setState({ action: { requestAction: 'bind' } });

  }

  componentWillReceiveProps(nextProps) {
    if (this.state.dataFlowState === dataFlowType.gettingVerifyCode) {
      this.setState({ dataFlowState: dataFlowType.gettedVerifyCode });
      if (nextProps.verifyCodeData.success && nextProps.verifyCodeData.data) {
        Toast.show(nextProps.verifyCodeData.data.msg);
      }
    }

    if (this.state.dataFlowState === dataFlowType.verifyingCode) {
      this.setState({ dataFlowState: dataFlowType.verifiedCode });
      Toast.show(nextProps.data.msg);
    }

    if (nextProps.success && nextProps.data.rcode === 0 && this.state.bindPhone) {
      this.context.router.push('/user/profile');
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetVerifyCodeBtnClick = (e) => {
    const { phone, action } = this.state;
    if (!this.state.getVerifyCodeBtnDsiabled) {
      this.setState({ getVerifyCodeBtnPressed: true, getVerifyCodeBtnDsiabled: true, remaining: '60s',
        dataFlowState: dataFlowType.gettingVerifyCode });
      this.props.fetchVerifyCode(phone, action.requestAction);

      this.tick();
      this.interval = setInterval(this.tick, 1000);

      _.delay(() => {
        this.setState({ getVerifyCodeBtnPressed: false });
      }, 50);
      _.delay(() => {
        this.setState({ getVerifyCodeBtnDsiabled: false });
      }, 60000);
    }
    e.preventDefault();
  }

  onBubmitBtnClick = (e) => {
    const { phone, verifyCode, action } = this.state;
    if (!verifyCode) {
      return;
    }
    this.setState({ bindPhone: true });
    this.setState({ submitBtnPressed: true });
    this.setState({ dataFlowState: dataFlowType.verifyingCode });
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

  tick = () => {
    let remaining = parseInt(this.state.remaining, 10);
    if (remaining > 0) {
      remaining--;
    } else if (remaining === 0) {
      remaining = 0;
    } else {
      remaining = 60;
    }
    if (remaining > 0) {
      this.setState({ remaining: remaining + 's' });
    } else {
      this.setState({ remaining: '获取验证码' });
      clearInterval(this.interval);
    }
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
        <div className="content">
          <Input type="number" placeholder={'请输入手机号码'} onChange={this.onPhoneChange} />
          <div className="row no-margin password-box bottom-border">
            <input className="col-xs-8" type="number" placeholder="请输入验证码" onChange={this.onVerifyCodeChange} />
            <button className={getVerifyCodeBtnCls} type="button" onClick={this.onGetVerifyCodeBtnClick} disabled={this.state.getVerifyCodeBtnDsiabled}>{this.state.remaining}</button>
          </div>
          <div className="row no-margin">
            <button className={bindPhoneBtnCls} type="button" onClick={this.onBubmitBtnClick} disabled={this.state.submitBtnDisabled}>提交</button>
          </div>
        </div>
      </div>
    );
  }
}
