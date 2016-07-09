import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { DownloadAppPopup } from 'components/DownloadAppPopup';
import * as utils from 'utils';
import * as constants from 'constants';
import moment from 'moment';

// global styles for app
import './styles/app.scss';

export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  state = {
    popupActive: !window.sessionStorage.hideDowloadAppPopup,
  }

  componentWillMount() {
    const { query } = this.props.location;
    const mmLinkId = query.mm_linkid || '';
    const uFrom = query.ufrom || '';
    if (mmLinkId) {
      window.document.cookie = `mm_linkid=${mmLinkId}; Path=/; Max-Age=${moment().add(1, 'day').toISOString()}`;
    }
    if (uFrom) {
      window.document.cookie = `ufrom=${uFrom}; Path=/; Max-Age=${moment().add(1, 'day').toISOString()}`;
    }
  }

  onCloseClick = (e) => {
    window.sessionStorage.setItem('hideDowloadAppPopup', true);
    this.setState({ popupActive: false });
  }

  onDownlodClick = (e) => {
    window.location.href = constants.downloadAppUri;
  }

  render() {
    return (
      <div>
        {this.props.children}
        <DownloadAppPopup active={this.state.popupActive && !utils.detector.isApp()} onClose={this.onCloseClick} onDownload={this.onDownlodClick} />
      </div>
    );
  }
}
