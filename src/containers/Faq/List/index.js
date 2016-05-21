Ïimport React, { Component } from 'react';
import _ from 'underscore';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as actionCreators from 'actions/faq/questions';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import QuestionItem from './QuestionItem';

import './index.scss';

@connect(
  state => ({
    data: state.questions.data,
    isLoading: state.questions.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class FaqList extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    data: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    error: React.PropTypes.bool,
    fetchQuestions: React.PropTypes.func,
    params: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
    this.state = {
      open: false,
    };
  }

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchQuestions(params.id);
  }

  onItemClick = (e) => {
    this.setState({ open: !this.state.open });
    e.preventDefault();
  };

  render() {
    const { data, isLoading } = this.props;
    const props = this.props;
    const questions = data.results || [];
    const btnCls = classnames({
      ['col-xs-1 icon-balck']: 1,
      ['icon-angle-down']: !this.state.open,
      ['icon-angle-up']: this.state.open,
    });
    return (
      <div>
        <Header title={props.params.name} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
        {isLoading ? <Loader/> : null}
          <ul className="questions-list">
            {questions.map((item, index) => {
              return <QuestionItem key={index} data={item} />;
            })}
          </ul>
        </div>
      </div>
    );
  }
}
