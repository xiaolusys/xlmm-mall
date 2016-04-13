import React, { Component } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

export class FaqList extends Component {
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
      <div>
        <Header title="物流问题" leftIcon="icon-angle-left" leftBtnClick={props.history.goBack} />
        <Footer />
      </div>
    );
  }
}
