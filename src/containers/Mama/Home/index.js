import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as plugins from 'plugins';
import { If } from 'jsx-control-statements';
import { connect } from 'react-redux';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { Image } from 'components/Image';
import MakemoneyTab from './makemoney';

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
    topTab: 'makemoney',
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
        case 'makemoney':
          this.setState({
            topTab: id,
          });

          break;
        case 'forum':
          this.setState({
            topTab: id,

          });
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
            <Choose>
            <When condition={topTab === 'makemoney'}>
              <MakemoneyTab/>
            </When>
            <When condition={topTab === 'forum'}>
              <iframe src={'http://forum.xiaolumeimei.com'} />
            </When>
            </Choose>
          </div>
          <div className="row no-margin top-border base-tab">
            <ul className="row no-margin">
              <li key={1} data-id="makemoney" onClick={this.onTabClick}>
                <p className={'col-xs-4 no-margin no-padding text-center' + (topTab === 'makemoney' ? ' active' : '')}>
                  <span>我要赚钱</span>
                </p>
              </li>
              <li key={2} data-id="forum" onClick={this.onTabClick}>
                <p className={'col-xs-4 no-margin no-padding text-center' + (topTab === 'forum' ? ' active' : '')}>
                  <span>论坛</span>
                </p>
              </li>
              <li key={3} data-id="myinfo" onClick={this.onTabClick}>
                <p className={'col-xs-4 no-margin no-padding text-center' + (topTab === 'myinfo' ? ' active' : '')}>
                  <span>我的</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
