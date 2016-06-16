import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/exam';
import { Header } from 'components/Header';
import { Toast } from 'components/Toast';
import { Image } from 'components/Image';
import { Popup } from 'components/Popup';
import * as utils from 'utils';
import moment from 'moment';
import * as plugins from 'plugins';
import classnames from 'classnames';
import _ from 'underscore';

import './index.scss';

const staticBase = 'http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/exam/question/';
@connect(
  state => ({
    exam: state.exam,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Question extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    exam: React.PropTypes.object,
    fetchExamQuestion: React.PropTypes.func,
    commitAnswer: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'activity-exam-question',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    selected: [],
    popupOpened: true,
    finishedPopupOpend: false,
  }

  componentWillMount() {
    const { type, id } = this.props.params;
    if (Number(id) === -1) {
      this.props.fetchExamQuestion(type);
    } else {
      this.props.fetchExamQuestion(type, id);
    }

  }

  componentDidMount() {
    document.body.classList.add('activity-exam-bg');
  }

  componentWillReceiveProps(nextProps) {
    const { answer, question } = nextProps.exam;
    const { type } = this.props.params;
    const nextQuestionId = question.data.next_id;
    if (!answer.isLoading && answer.success && answer.data.code === 0) {
      const next = this.getNextQuestion();
      if (Number(type) === 3 && !nextQuestionId) {
        this.setState({ finishedPopupOpend: true });
      } else {
        window.location.href = `/mall/activity/exam/question/${next.type}/${next.id}`;
      }
    } else if (!answer.isLoading && answer.success && answer.data.info) {
      Toast.show(answer.data.info);
    }
    if (!question.isLoading && question.success && !_.isEmpty(question.data.user_answer) && _.isEmpty(this.state.selected)) {
      this.setState({ selected: question.data.user_answer.answer.split('') });
    }
  }

  componentWillUnmount() {
    document.body.classList.remove('activity-exam-bg');
  }

  onOptionClick = (e) => {
    const { type } = this.props.params;
    const { optionid } = e.currentTarget.dataset;
    let { selected } = this.state;
    switch (Number(type)) {
      case 1:
        this.setState({ selected: [optionid] });
        break;
      case 2:
        if (_.contains(selected, optionid)) {
          selected = _.without(selected, optionid);
        } else {
          selected.push(optionid);
        }
        this.setState({ selected: selected });
        break;
      case 3:
        this.setState({ selected: [optionid] });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onNextQuestionBtnClick = (e) => {
    const id = this.props.exam.question.data.question_content.id;
    this.props.commitAnswer(id, this.state.selected.join(''));
    e.preventDefault();
  }

  onExitBtnClick = (e) => {
    this.context.router.replace('/');
    e.preventDefault();
  }

  onClosePopupClick = (e) => {
    this.setState({ popupOpened: false });
    e.preventDefault();
  }

  onCheckAgainBtnClick = (e) => {
    window.location.href = '/activity/exam/question/1/-1';
  }

  onCommitBtnClick = (e) => {
    const question = this.props.exam.question.data || {};
    this.context.router.push(`/activity/exam/result?sheaves=${question.question_content.sheaves}`);
  }

  getNextQuestion = () => {
    const question = this.props.exam.question.data || {};
    const currentType = this.props.params.type;
    const nextQuestionId = question.next_id;
    if (nextQuestionId) {
      return { type: currentType, id: nextQuestionId };
    } else if (Number(currentType) < 3) {
      return { type: Number(currentType) + 1, id: -1 };
    }
  }

  render() {
    const { prefixCls, exam } = this.props;
    const question = exam.question.data || {};
    const { type, id } = this.props.params;
    const { selected } = this.state;
    return (
      <div className={`${prefixCls} col-xs-12 col-sm-8 col-sm-offset-2 no-padding`}>
        <div className="question-header">
          <Image src={`${staticBase}red-bg.png`} />
          <img className="exit-btn" src={`${staticBase}exit-btn.png`} onClick={this.onExitBtnClick} />
          <img className="header-text" src={`${staticBase}title-part-${type}.png`} onClick={this.context.router.goBack} />
        </div>
        <If condition={!_.isEmpty(question)}>
          <div className="question-body">
            <p>
              <span className="font-36 font-red">{question.current_no || 0}</span>
              <span className="font-24">{'/' + (question.question_count || 0)}</span>
            </p>
            <p className="font-lg font-weight-600">{question.question_content && question.question_content.question}</p>
            <ul>
            {question.question_content && question.question_content.question_choice.map((option, index) => {
              const optionCls = classnames({
                ['option']: true,
                ['active']: _.contains(selected, option.choice_title),
              });
              if (Number(type) === 1 || Number(type) === 2) {
                return (
                  <li className={optionCls} key={index} data-optionid={option.choice_title} onClick={this.onOptionClick}>
                    <p className="col-xs-2 text-center left">{option.choice_title}</p>
                    <p className="col-xs-10 text-left right">{option.choice_text}</p>
                  </li>
                );
              }
              if (Number(type) === 3) {
                return (
                  <li className={optionCls} key={index} data-optionid={option.choice_title} onClick={this.onOptionClick}>
                    <p className="col-xs-12 center text-center ">{option.choice_text}</p>
                  </li>
                );
              }
            })}
            </ul>
          </div>
        </If>
        <div>
          <If condition={(Number(type) === 1 && Number(id) !== -1) || Number(type) === 2 || Number(type) === 3 }>
            <img className="pull-left previous-btn" src="http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/exam/previous-btn.png" onClick={this.context.router.goBack} />
          </If>
          <img className="pull-right next-btn" src="http://7xogkj.com1.z0.glb.clouddn.com/mall/activity/exam/next-btn.png" onClick={this.onNextQuestionBtnClick} />
        </div>
        <Popup active={this.state.popupOpened && Number(id) === -1} height="none" onPopupOverlayClick={this.onClosePopupClick}>
          <img className="col-xs-12" src={`${staticBase}title-part-${type}.png`} />
        </Popup>
        <Popup active={this.state.finishedPopupOpend} height="100%">
          <img className="col-xs-12" src={`${staticBase}text-finished-exam.png`} />
          <div className="row no-margin exam-btn-group">
            <div className="col-xs-6">
              <img className="col-xs-12" src={`${staticBase}check-again-btn.png`} onClick={this.onCheckAgainBtnClick} />
            </div>
            <div className="col-xs-6">
              <img className="col-xs-12" src={`${staticBase}commit-btn.png`} onClick={this.onCommitBtnClick} />
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}
