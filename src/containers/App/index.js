import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as utils from 'utils';
import * as constants from 'constants';

// global styles for app
import './styles/app.scss';

export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  componentWillMount() {
    const { query } = this.props.location;
    const mmLinkId = query.mm_linkid || 0;
    const uFrom = query.ufrom || '';
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
    if (mmLinkId && mmLinkId > 0) {
      window.document.cookie = `mm_linkid=${mmLinkId}; Path=/; expires=${expires.toGMTString()};`;
    }
    if (uFrom) {
      window.document.cookie = `ufrom=${uFrom}; Path=/; expires=${expires.toGMTString()};`;
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
