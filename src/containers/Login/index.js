import React, { Component } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';

export class Login extends Component {
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
        <Header title="登录" leftIcon="icon-angle-left" leftBtnClick={this.onMenuBtnClick} />
        <div className="content has-header">
          <Input />
          <Footer />
        </div>
      </div>
    );
  }
}
