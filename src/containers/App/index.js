import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as utils from 'utils';
import * as actionCreators from 'actions/wechat/sign';

// global styles for app
import './styles/app.scss';

@connect(
  state => ({
    wechatSign: state.wechatSign,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class App extends Component {
  static propTypes = {
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    fetchWechatSign: React.PropTypes.func,
    wechatSign: React.PropTypes.object,
  };

  state = {}

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
    if (utils.detector.isWechat()) {
      this.props.fetchWechatSign();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { wechatSign } = nextProps;
    if (!wechatSign.isLoading && wechatSign.success) {
      utils.wechat.config(wechatSign.data);
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
