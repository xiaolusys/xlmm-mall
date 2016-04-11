import React, { Component } from 'react';
import { Header } from 'components/Header';
import _ from 'underscore';

export class List extends Component {
  static propTypes = {

  };

  static defaultProps = {

  }

  constructor(props) {
    super(props);
  }

  onItemClick = (e) => {
    e.preventDefault();
  };

  render() {
    const props = this.props;
    return (
      <section>
        <Header title="小鹿美美" leftIcon="icon-angle-left" rightIcon="" />
      </section>
    );
  }
}
