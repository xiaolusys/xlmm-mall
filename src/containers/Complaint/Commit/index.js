import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import _ from 'underscore';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Toast } from 'components/Toast';
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
    complaintCommit: React.PropTypes.any,
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
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.complaintCommit.success) {
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
    this.props.commitComplaint();
    this.setState({ save: true });
  }

  render() {
    const bindPhoneBtnCls = classnames({
      ['col-xs-10 col-xs-offset-1 margin-top-xs button button-energized']: 1,
    });
    return (
      <div>
        <Header title="投诉建议" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content complaint-container">
          <textarea placeholder="请输入您的意见和建议，以便我们更好地服务于您!" value={this.state.textareaContent} onChange={this.onTextareaChange}></textarea>
          <p className="col-xs-12 text-right no-margin font-grey-light text-range">{this.state.textRange}</p>
          <div className="row no-margin">
            <button className={bindPhoneBtnCls} type="button" onClick={this.onBubmitBtnClick} disabled={this.state.save}>提交</button>
          </div>
          <Link to="/complaint/history">
            <p className="col-xs-12 text-right no-margin font-grey-light margin-top-xs margin-bottom-xs">查看历史纪录</p>
          </Link>
          <Footer/>
        </div>
      </div>
    );
  }
}
