import React, { Component } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

export class Login extends Component {
  static propTypes = {

  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  render() {
    console.log(this);
    const props = this.props;
    return (
      <div>
        <Header title="登录" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <Footer />
      </div>
    );
  }
}
