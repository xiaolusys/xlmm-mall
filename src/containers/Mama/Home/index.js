import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import BoutiqueExchg from '../BoutiqueExchange';

import './index.scss';

export default class MamaHome extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    topTab: 'boutique',
  }

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {

  }

  onLeftBtnClick = (e) => {
    if (utils.detector.isApp()) {
      plugins.invoke({
        method: 'callNativeBack',
      });
      return;
    }
    this.context.router.goBack();
  }

  onTabClick = (e) => {
    const { id, type } = e.currentTarget.dataset;
      switch (id) {
        case 'boutique':
          this.setState({
            topTab: id,

          });
          // window.location.href = '/mall/mama/boutique';
          break;
        case 'myinfo':
          this.setState({
            topTab: id,
          });
          break;
        default:
      }

    e.preventDefault();
  }

  render() {
    const { topTab } = this.state;

    return (
      <div className="home-root">
        <Header title="妈妈中心" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="content mamahome">
          <div className="mamahome-container">
            <BoutiqueExchg />
          </div>
        </div>
      </div>
    );
  }
}
