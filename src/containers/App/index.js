import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as utils from 'utils';
import * as constants from 'constants';
import _ from 'underscore';

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
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
    if (mmLinkId) {
      window.document.cookie = `mm_linkid=${mmLinkId}; Path=/; expires=${expires.toGMTString()};`;
    }
    if (uFrom) {
      window.document.cookie = `ufrom=${uFrom}; Path=/; expires=${expires.toGMTString()};`;
    }
  }

  onCloseClick = (e) => {
    window.sessionStorage.setItem('hideDowloadAppPopup', true);
    this.setState({ popupActive: false });
  }

  onDownlodClick = (e) => {
    const mmLinkId = utils.cookie.getCookie('mm_linkid') || '';
    const uFrom = utils.cookie.getCookie('ufrom') || '';
    window.location.href = `${constants.downloadAppUri}?mm_linkid=${mmLinkId}&ufrom=${uFrom}`;
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
