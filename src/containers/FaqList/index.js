import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/faq/questions';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

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
  };

  static defaultProps = {

  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchQuestions();
  }

  onItemClick = (e) => {
    e.preventDefault();
  };

  render() {
    const props = this.props;
    return (
      <div>
        <Header title="物流问题" leftIcon="icon-angle-left" leftBtnClick={props.history.goBack} />
        <Footer />
      </div>
    );
  }
}
