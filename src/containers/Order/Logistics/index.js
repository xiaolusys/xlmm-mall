import React, { Component } from 'react';
import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

export default class Logistics extends Component {
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
        <Header title="物流信息" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content has-header">
            <Footer />
          </div>
      </div>
    );
  }
}
