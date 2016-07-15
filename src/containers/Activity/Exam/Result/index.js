import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/exam';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';
import * as utils from 'utils';
import moment from 'moment';
import * as plugins from 'plugins';

import './index.scss';

const staticBase = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/exam/question/';
@connect(
  state => ({
    exam: state.exam,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Result extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.object,
    fetchExamResult: React.PropTypes.func,
    exam: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'activity-exam-result',
  };

  constructor(props, context) {
    super(props);
    context.router;
    moment.locale('zh-cn');
  }

  state = {

  }

  componentWillMount() {
    const { sheaves } = this.props.location.query;
    this.props.fetchExamResult(sheaves);
  }

  componentDidMount() {
    document.body.classList.add('activity-exam-bg');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exam.result.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    document.body.classList.remove('activity-exam-bg');
  }

  onExitBtnClick = (e) => {
    this.context.router.replace('/');
    e.preventDefault();
  }

  render() {
    const { prefixCls, exam } = this.props;
    const result = exam.result.data.exam_result || {};
    return (
      <div className={`${prefixCls} clearfix`}>
        <img className="exit-btn" src={`${staticBase}exit-btn.png`} onClick={this.onExitBtnClick} />
        <div className="score-container">
          <Image src="http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/exam/result-bg.png" />
          <div className="score">
            <p className="font-xlg">你的成绩</p>
            <p className="font-86 font-weight-600 font-yellow-light">{result.total_point}</p>
          </div>
        </div>
        <If condition={result.is_passed}>
          <img className="col-xs-12 margin-top-xlg" src={`${staticBase}text-pass-exam.png`} />
        </If>
        <If condition={!result.is_passed}>
          <p className="col-xs-12 margin-top-xlg failed-exam text-center">请加油学习吧，别忘了分享邀请哦~</p>
        </If>
      </div>
    );
  }
}
