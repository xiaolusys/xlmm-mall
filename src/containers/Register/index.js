import React, { Component } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Input } from 'components/Input';

export class Register extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

  }

  noNextClick = (e) => {

  }

  render() {
    const props = this.props;
    return (
      <div>
        <Header title="注册" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
        <div className="content has-header">
          <Input type="number" placeholder="请输入手机号"/>
          <Input type="password" placeholder="请输入验证码" />
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-energized" type="button" onClick={this.noNextClick}>下一步</button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
