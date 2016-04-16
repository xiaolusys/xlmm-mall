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

  onMenuBtnClick(e) {
    console.log(e);
  }

  render() {
    const props = this.props;
    return (
      <div>
        <Header title="小鹿美美" leftIcon="icon-bars" leftBtnClick={this.onMenuBtnClick} />
        <Footer />
      </div>
    );
  }
}
