import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/faq/categories';
import { Header } from 'components/Header';

@connect(
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class FaqCategory extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    return (
      <section>
        <Header title="常见问题" leftIcon="icon-angle-left" rightIcon="icon-angle-up" leftBtnClick={props.history.goBack} />
        {this.props.children}
      </section>
    );
  }
}
