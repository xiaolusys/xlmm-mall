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
    const mmLinkId = utils.url.getQueryValue('mm_linkid') || '';
    const uFrom = utils.url.getQueryValue('ufrom');

    if (mmLinkId) {
      window.document.cookie = 'mm_linkid=' + mmLinkId;
    }
    if (uFrom) {
      window.document.cookie = 'ufrom=' + uFrom;
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
