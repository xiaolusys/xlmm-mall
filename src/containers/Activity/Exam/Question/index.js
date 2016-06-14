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
import classnames from 'classnames';

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
    location: React.PropTypes.object,
    exam: React.PropTypes.object,
    fetchExamQuestion: React.PropTypes.func,
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

  }

  componentWillMount() {
    this.props.fetchExamQuestion();
  }

  componentDidMount() {
    document.body.classList.add('exam-bg');
  }

  componentWillUnmount() {
    document.body.classList.remove('exam-bg');
  }

  onOptionClick = (e) => {

  }

  render() {
    const { prefixCls, exam } = this.props;
    const question = exam.question.data || {};
    const type = this.props.location.query.type || 1;
    const optionCls = classnames({
      ['option']: true,
    });
    return (
      <div className={`${prefixCls} col-xs-12 col-sm-8 col-sm-offset-2 no-padding`}>
        <div className="question-header">
          <Image src={`${staticBase}red-bg.png`} />
          <img className="exit-btn" src={`${staticBase}exit-btn.png`} onClick={this.context.router.goBack} />
          <img className="header-text" src={`${staticBase}title-part-${type}.png`} onClick={this.context.router.goBack} />
        </div>
        <div className="question-body">
          <p>
            <span className="font-36 font-red">{question.current_no || 0}</span>
            <span className="font-24">{'/' + (question.question_count || 0)}</span>
          </p>
          <p className="font-lg font-weight-600">{question.question_content && question.question_content.question}</p>
          <ul>
          {question.question_content && question.question_content.question_choice.map((option, index) => {
            return (
              <If condition={type === 1}>
                <li className="option" key={index} data-id={option.choice_title} onClick={this.onOptionClick}>
                  <p className="col-xs-2 text-center left">{option.choice_title}</p>
                  <p className="col-xs-10 text-left right">{option.choice_text}</p>
                </li>
              </If>
            );
          })}
          </ul>
        </div>
      </div>
    );
  }
}
