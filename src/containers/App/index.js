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
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000));
    if (mmLinkId && Number(mmLinkId) > 0) {
      window.document.cookie = `mm_linkid=${mmLinkId}; Path=/; expires=${expires.toGMTString()};`;
    }
    if (uFrom) {
      window.document.cookie = `ufrom=${uFrom}; Path=/; expires=${expires.toGMTString()};`;
    }
  }

  render() {
    const { app } = this.props.location.query;
    if (app === 'jimay') {
      window.document.title = '己美医学－心怀大爱，助人助己，传播健康，传递责任.';
    } else {
      window.document.title = '小鹿美美 -　时尚，健康，美丽！';
    }
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
