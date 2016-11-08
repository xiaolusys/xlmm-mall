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
import EverydayPushTab from './everydaypush';

import './index.scss';

export default class MamaEverydayPush extends Component {
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
    topTab: 'day',
    sticky: false,
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
        case 'day':
          this.setState({
            topTab: id,
          });

          break;
        case 'category':
          this.setState({
            topTab: id,

          });
          break;
        case 'botique':
          this.setState({
            topTab: id,
          });
          break;
        default:
      }

    e.preventDefault();
  }

  render() {
    const { topTab, sticky } = this.state;

    return (
      <div className="push-root">
        <Header title="每日推送" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="content pushhome">
          <div className={'row no-margin bottom-border base-tab '} >
            <ul className="row no-margin">
              <li key={1} data-id="day" onClick={this.onTabClick}>
                <p className={'col-xs-4 no-margin no-padding text-center' + (topTab === 'day' ? ' active' : '')}>
                  <span>按日期展示</span>
                </p>
              </li>
              <li key={2} data-id="category" onClick={this.onTabClick}>
                <p className={'col-xs-4 no-margin no-padding text-center' + (topTab === 'category' ? ' active' : '')}>
                  <span>按分类展示</span>
                </p>
              </li>
              <li key={3} data-id="botique" onClick={this.onTabClick}>
                <p className={'col-xs-4 no-margin no-padding text-center' + (topTab === 'botique' ? ' active' : '')}>
                  <span>按精品展示</span>
                </p>
              </li>
            </ul>
          </div>
          <div className="pushhome-container">
            <Choose>
            <When condition={topTab === 'day'}>
              <EverydayPushTab />
            </When>
            <When condition={topTab === 'category'}>
              <EverydayPushTab />
            </When>
            <When condition={topTab === 'botique'}>
              <EverydayPushTab />
            </When>
            </Choose>
          </div>
        </div>
      </div>
    );
  }
}
