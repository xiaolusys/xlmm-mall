import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as utils from 'utils';

// global styles for app
import './styles/app.scss';

export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  componentWillMount() {
    const { query } = this.props.location;
    const mmLinkId = query.mm_linkid || '';
    const uFrom = query.ufrom || '';
    if (mmLinkId) {
      window.document.cookie = 'mm_linkid=' + mmLinkId + '; Path=/';
    }
    if (uFrom) {
      window.document.cookie = 'ufrom=' + uFrom + '; Path=/';
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
