import React, { Component } from 'react';

// global styles for app
import './styles/app.scss';

export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
  };

  render() {
    return (
      <div>
        {this.props.children}
        <footer className="text-center copyright">
          <p>Copyright © 2014-2015 小鹿美美，All Rights Reserved</p>
          <p> 沪ICP备15013901号-1</p>
        </footer>
      </div>
    );
  }
}
