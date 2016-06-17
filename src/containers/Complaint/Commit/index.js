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
    textareaContent: '',
    textRange: '0/500',
    typeIndex: 1,
    typeOrder: true,
    typeSuggest: false,
    typeAftersale: false,
    typeOther: false,
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.complaint.success) {
      Toast.show('提交成功');
      this.setState({
        textareaContent: '',
        textRange: '0/500',
      });
    }
  }

  onRightBtnClick = (e) => {
    this.context.router.push('/complaint/history');
  }

  onComplaintTypeChange = (e) => {
    const type = e.target['data-type'];
    switch (type) {
      case '1':
        this.setState({
          typeIndex: 1,
          typeOrder: true,
          typeSuggest: false,
          typeAftersale: false,
          typeOther: false,
        });
        break;
      case '2':
        this.setState({
          typeIndex: 2,
          typeOrder: false,
          typeSuggest: true,
          typeAftersale: false,
          typeOther: false,
        });
        break;
      case '3':
        this.setState({
          typeIndex: 3,
          typeOrder: false,
          typeSuggest: false,
          typeAftersale: false,
          typeOther: true,
        });
        break;
      case '4':
        this.setState({
          typeIndex: 4,
          typeOrder: false,
          typeSuggest: false,
          typeAftersale: true,
          typeOther: false,
        });
        break;
      default:
        break;
    }
  }

  onTextareaChange = (e) => {
    const value = e.currentTarget.value;
    const leftLength = 500 - value.length;
    this.setState({
      save: !value.length,
    });
    if (leftLength >= 0) {
      this.setState({
        textareaContent: value,
        textRange: '0/' + leftLength,
      });
    }
  }

  onBubmitBtnClick = () => {
    this.props.commitComplaint(this.state.textareaContent, this.state.typeIndex);
    this.setState({ save: true });
  }

  render() {
    return (
      <div>
        <Header title="投诉建议" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} rightText="历史记录" onRightBtnClick={this.onRightBtnClick} />
        <div className="content complaint-container">
          <div className="col-xs-12 padding-top-xs padding-bottom-xs complaint-type">
            <Checkbox className="col-xs-3 no-margin no-padding" data-type="1" checked={this.state.typeOrder} onChange={this.onComplaintTypeChange}> 订单相关</Checkbox>
            <Checkbox className="col-xs-3 no-margin no-padding" data-type="2" checked={this.state.typeSuggest} onChange={this.onComplaintTypeChange}> 意见/建议</Checkbox>
            <Checkbox className="col-xs-3 no-margin no-padding" data-type="4" checked={this.state.typeAftersale} onChange={this.onComplaintTypeChange}> 售后问题</Checkbox>
            <Checkbox className="col-xs-3 no-margin no-padding" data-type="3" checked={this.state.typeOther} onChange={this.onComplaintTypeChange}> 其它问题</Checkbox>
          </div>
          <textarea className="margin-top-xs" placeholder="请描述您的具体问题，我们将尽快为你解决！" value={this.state.textareaContent} onChange={this.onTextareaChange}></textarea>
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
