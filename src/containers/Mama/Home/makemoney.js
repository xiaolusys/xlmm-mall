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
import * as mamaBaseInfoAction from 'actions/mama/mamaBaseInfo';

import './index.scss';

const actionCreators = _.extend(mamaBaseInfoAction);

@connect(
  state => ({
    mamaBaseInfo: state.mamaBaseInfo,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class MakemoneyTab extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    mamaBaseInfo: React.PropTypes.any,
    fetchMamaFortune: React.PropTypes.func,
    fetchMamaWebCfg: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

    sticky: false,
    hasMore: false,

  }

  componentWillMount() {
    this.props.fetchMamaFortune();
    this.props.fetchMamaWebCfg();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaBaseInfo } = nextProps;

    if (mamaBaseInfo.mamaFortune.isLoading || mamaBaseInfo.mamaWebCfg.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onScroll = (e) => {
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

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderActivities(activities) {
    return (
      <ul className="margin-bottom-lg">
        {activities.map((activity, index) => {
          return (
            <a href={activity.act_link} key={activity.id}>
              <li className="row no-margin margin-top-xs">
                <Image className="col-xs-12 no-padding" src={activity.act_img} key={index}/>
              </li>
            </a>
          );
        })}
      </ul>
    );
  }

  render() {
    const { topTab, sticky } = this.state;
    const activityData = this.props.mamaBaseInfo.mamaWebCfg.success ? this.props.mamaBaseInfo.mamaWebCfg.data.results[0].mama_activities : [];
    return (
      <div>
        <div className="content makemoney-container">
        </div>
        { this.renderActivities(activityData) }
      </div>
    );
  }
}
