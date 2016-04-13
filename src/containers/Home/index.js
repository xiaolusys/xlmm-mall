import React, { Component } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

export class Home extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    return (
      <div>
        <Header title="小鹿美美" leftIcon="icon-angle-left" leftBtnClick={props.history.goBack} />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
