import React, { Component } from 'react';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as actionCreators from 'actions/faq/questions';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import QuestionItem from './QuestionItem';

import './index.scss';

@connect(
  state => ({
    data: state.questions.data,
    isLoading: state.questions.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class FaqList extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    data: React.PropTypes.any,
    dispatch: React.PropTypes.func,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchQuestions: React.PropTypes.func,
    params: React.PropTypes.object,
  };

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchQuestions(params.categoryId);
  }

  onItemClick = (e) => {
    this.setState({ open: !this.state.open });
    e.preventDefault();
  };

  render() {
    const { data } = this.props;
    const props = this.props;
    const questions = data.results || [];
    const btnCls = classnames({
      ['col-xs-1 icon-balck']: 1,
      ['icon-angle-down']: !this.state.open,
      ['icon-angle-up']: this.state.open,
    });
    return (
      <div>
        <Header title={props.params.categoryName} leftIcon="icon-angle-left" leftBtnClick={props.history.goBack} />
        <div className="has-header content">
          <ul className="questions-list">
            {questions.map((item, index) => {
              return <QuestionItem key={index} data={item} />;
            })}
          </ul>
          <Footer />
        </div>
      </div>
    );
  }
}
