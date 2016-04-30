import React, { Component } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

export default class Detail extends Component {
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

  render() {
    return (
      <div>
        <Header title="订单详情" leftIcon="icon-angle-left" leftBtnClick={this.context.router.goBack} />
          <div className="content has-header">
            <Footer />
          </div>
      </div>
    );
  }
}
