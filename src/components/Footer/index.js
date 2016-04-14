import React, { Component } from 'react';

import './index.scss';

export class Footer extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  render() {
    return (
      <footer className="text-center font-xxs footer">
        <p>Copyright © 2014-2015 小鹿美美，All Rights Reserved</p>
        <p> 沪ICP备15013901号-1</p>
      </footer>
    );
  }
}
