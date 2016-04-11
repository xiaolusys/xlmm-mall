import React, { Component } from 'react';
import { Header } from 'components/Header';

export class FaqCategory extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  rightBtnClick = () => {

  };

  leftBtnClick = () => {

  };

  render() {
    return (
      <section>
        <Header title="常见问题" leftIcon="icon-angle-left" rightIcon="icon-angle-up" />
        {this.props.children}
      </section>
    );
  }
}
