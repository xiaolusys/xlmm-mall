import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import _ from 'underscore';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Toast } from 'components/Toast';
import { Checkbox } from 'components/Checkbox';
import * as actionCreators from 'actions/complaint/commit';
import * as utils from 'utils';
import * as plugins from 'plugins';

import './index.scss';

@connect(
  state => ({
    complaint: {
      data: state.complaintCommit.data,
      isLoading: state.complaintCommit.isLoading,
      error: state.complaintCommit.error,
      success: state.complaintCommit.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export default class Commit extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    commitComplaint: React.PropTypes.func,
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
    reasonContent: '',
    textRange: '0/500',
    typeIndex: 1,
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.complaint.success) {
      Toast.show('提交成功');
      this.setState({
        typeIndex: 1,
        reasonContent: '',
        textRange: '0/500',
      });
    }
  }

  onRightBtnClick = (e) => {
    this.context.router.push('/complaint/history');
    e.preventDefault();
  }

  onComplaintTypeChange = (e) => {
    this.setState({ typeIndex: Number(e.target.value) });
    e.preventDefault();
  }

  onTextareaChange = (e) => {
    const value = e.currentTarget.value;
    const leftLength = 500 - value.length;
    this.setState({
      save: !value.length,
    });
    if (leftLength >= 0) {
      this.setState({
        reasonContent: value,
        textRange: '0/' + leftLength,
      });
    }
    e.preventDefault();
  }

  onBubmitBtnClick = (e) => {
    const reasonContent = this.state.reasonContent;
    if (utils.string.isEmpty(reasonContent)) {
      Toast.show('内容不能为空！');
      return;
    }
    this.props.commitComplaint(reasonContent, this.state.typeIndex);
    this.setState({ save: true });
    e.preventDefault();
  }

  onLeftBtnClick = (e) => {
    if (utils.detector.isApp()) {
      plugins.invoke({
        method: 'callNativeBack',
      });
      return;
    }
    this.context.router.goBack();
  }

  render() {
    return (
      <div>
        <Header title="投诉建议" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick} rightText="历史记录" onRightBtnClick={this.onRightBtnClick} />
        <div className="content complaint-container">
          <div className="col-xs-12 padding-bottom-xs complaint-type">
            <Checkbox className="col-xs-4 padding-top-xs no-padding" value="1" checked={this.state.typeIndex === 1} onChange={this.onComplaintTypeChange}> 订单相关</Checkbox>
            <Checkbox className="col-xs-4 padding-top-xs no-padding" value="2" checked={this.state.typeIndex === 2} onChange={this.onComplaintTypeChange}> 意见/建议</Checkbox>
            <Checkbox className="col-xs-4 padding-top-xs no-padding" value="4" checked={this.state.typeIndex === 4} onChange={this.onComplaintTypeChange}> 售后问题</Checkbox>
            <Checkbox className="col-xs-4 padding-top-xs no-padding" value="3" checked={this.state.typeIndex === 3} onChange={this.onComplaintTypeChange}> 其它问题</Checkbox>
          </div>
          <textarea className="margin-top-xs" placeholder="请描述您的具体问题，我们将尽快为你解决！" value={this.state.reasonContent} onChange={this.onTextareaChange}></textarea>
          <p className="col-xs-12 text-right no-margin font-grey-light text-range">{this.state.textRange}</p>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.onBubmitBtnClick} disabled={this.state.save}>提交</button>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }
}
