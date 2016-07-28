import React, { Component } from 'react';
import { Header } from 'components/Header';

import './index.scss';

export default class Introduce extends Component {
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
        <Header title="活动简介" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack}/>
        <div className="content introduce-container">
          <div className="row no-margin">
            <img src="http://7xogkj.com1.z0.glb.clouddn.com/mall/university/v1/banner.png"/>
          </div>
        </div>
      </div>
    );
  }
}
