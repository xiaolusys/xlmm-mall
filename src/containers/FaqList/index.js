import React, { Component } from 'react';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/faq/questions';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

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
  }

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchQuestions(params.categoryId);
  }

  onItemClick = (e) => {
    e.preventDefault();
  };

  render() {
    const { data } = this.props;
    const questions = data.results;
    return (
      <div>
        <Header title="" leftIcon="icon-angle-left" leftBtnClick={ null } />
        <div className="has-header content">
          <ul className="questions-list">
          <If condition={_.isArray(questions)}>
          {
            questions.map((item, index) => {
              return (
                <li className="row" key={index}>
                  <div>
                    <p className="col-xs-11 font-md">{item.question}</p>
                    <i className="col-xs-1 icon-angle-down icon-balck"></i>
                  </div>
                  <p className="collapse">{item.answer}</p>
                </li>
              );
            })
          }
          </If>
          </ul>
          <Footer />
        </div>
      </div>
    );
  }
}
