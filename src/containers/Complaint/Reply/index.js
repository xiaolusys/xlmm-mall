import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import _ from 'underscore';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Toast } from 'components/Toast';
import * as actionCreators from 'actions/complaint/reply';

import './index.scss';

@connect(
  state => ({
    complaint: {
      data: state.complaintReply.data,
      isLoading: state.complaintReply.isLoading,
      error: state.complaintReply.error,
      success: state.complaintReply.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class Reply extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    complaintReply: React.PropTypes.any,
    fetchComplaintHistories: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    save: true,
    textareaContent: '',
    textRange: '0/500',
  }

  componentWillMount() {
    this.props.fetchComplaintHistories();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.complaintReply.success) {
      Toast.show('提交成功');
      this.setState({
        textareaContent: '',
      });
    }
  }

  onTextareaChange = (e) => {
    const value = e.currentTarget.value;
    const leftLength = 500 - value.length;
    if (leftLength >= 0) {
      this.setState({
        textareaContent: value,
        save: false,
        textRange: '0/' + leftLength,
      });
    }
  }

  onBubmitBtnClick = () => {
    this.props.fetchComplaintHistories();
    this.setState({ save: true });
  }

  render() {
    const bindPhoneBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
    });
    return (
      <div>
        <Header title="反馈回复" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content">
          <ul className="complaint-reply-list">
            <li className="bottom-border row no-margin margin-bottom-xs">
              <p className="col-xs-12 text-left no-margin text-range bottom-border padding-top-xxs padding-bottom-xxs">正在购买东西，app闪退了好几次。感觉很是不方便。希望重视这个问题。</p>
              <div className="col-xs-12 no-margin margin-bottom-xs margin-top-xs">
                <p className="no-margin padding-bottom-xxs">
                  <i className="icon-xiaolu font-grey-light margin-right-xs"></i>
                  <span>鹿小美</span>
                </p>
                <textarea className="col-xs-11 col-xs-offset-1" placeholder="请输入您的意见和建议，以便我们更好地服务于您!" value={'非常抱歉给您带来的不便~~~ ，建议您退出登录下，然后切换下网络尝试操作以下~~~或者是卸载从装一下软件最新版本试试哦~~~~'}>
                </textarea>
              </div>
            </li>
            <li className="bottom-border row no-margin margin-bottom-xs">
              <p className="col-xs-12 text-left no-margin text-range bottom-border padding-top-xxs padding-bottom-xxs">正在购买东西，app闪退了好几次。感觉很是不方便。希望重视这个问题。</p>
              <div className="col-xs-12 no-margin margin-bottom-xs margin-top-xs">
                <p className="no-margin padding-bottom-xxs">
                  <i className="icon-xiaolu font-grey-light margin-right-xs"></i>
                  <span>鹿小美</span>
                </p>
                <textarea className="col-xs-11 col-xs-offset-1" placeholder="请输入您的意见和建议，以便我们更好地服务于您!" value={'非常抱歉给您带来的不便~~~'}>
                </textarea>
              </div>
            </li>
            <li className="bottom-border row no-margin margin-bottom-xs">
              <p className="col-xs-12 text-left no-margin text-range bottom-border padding-top-xxs padding-bottom-xxs">正在购买东西，app闪退了好几次。感觉很是不方便。希望重视这个问题。</p>
              <div className="col-xs-12 no-margin margin-bottom-xs margin-top-xs">
                <p className="no-margin padding-bottom-xxs">
                  <i className="icon-xiaolu font-grey-light margin-right-xs"></i>
                  <span>鹿小美</span>
                </p>
                <textarea className="col-xs-11 col-xs-offset-1" placeholder="请输入您的意见和建议，以便我们更好地服务于您!" value={'非常抱歉给您带来的不便~~~ ，建议您退出登录下，然后切换下网络尝试操作以下~~~或者是卸载从装一下软件最新版本试试哦~~~~'}>
                </textarea>
              </div>
            </li>
            <li className="bottom-border row no-margin margin-bottom-xs">
              <p className="col-xs-12 text-left no-margin text-range bottom-border padding-top-xxs padding-bottom-xxs">正在购买东西，app闪退了好几次。感觉很是不方便。希望重视这个问题。</p>
              <div className="col-xs-12 no-margin margin-bottom-xs margin-top-xs">
                <p className="no-margin padding-bottom-xxs">
                  <i className="icon-xiaolu font-grey-light margin-right-xs"></i>
                  <span>鹿小美</span>
                </p>
                <textarea className="col-xs-11 col-xs-offset-1" placeholder="请输入您的意见和建议，以便我们更好地服务于您!" value={'非常抱歉给您带来的不便~~~ ，建议您退出登录下，然后切换下网络尝试操作以下~~~或者是卸载从装一下软件最新版本试试哦~~~~'}>
                </textarea>
              </div>
            </li>
          </ul>
          <Footer/>
        </div>
      </div>
    );
  }
}
