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
import * as mamaBaseInfoAction from 'actions/mama/mamaBaseInfo';

import './myinfo.scss';

const actionCreators = _.extend(mamaBaseInfoAction);

@connect(
  state => ({
    mamaBaseInfo: state.mamaBaseInfo,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class MyInfoTab extends Component {
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

  onInfoClick = (e) => {
    const { id } = e.currentTarget.dataset;
      switch (id) {
        case '1':
          break;
        default:
      }
    e.preventDefault();
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { mamaFortune, mamaWebCfg } = this.props.mamaBaseInfo;
    return (
      <div className="content myinfo-container">
        <div className="row my-level bottom-border">
          <img className="col-xs-3 my-thumbnail" src ={(mamaFortune.success && mamaFortune.data) ? mamaFortune.data.extra_info.thumbnail : ''} />
          <p className="col-xs-3 text-center">{'ID:' + (mamaFortune.success && mamaFortune.data) ? mamaFortune.data.mama_id : 0}</p>
          <p className="col-xs-3 text-center">{'ID:' + (mamaFortune.success && mamaFortune.data) ? mamaFortune.data.mama_level_display : 0}</p>
          <p className="col-xs-3 text-center">{(mamaFortune.success && mamaFortune.data) ? mamaFortune.extra_info.agencylevel_display : 0}</p>
        </div>
        <div className="bottom-border cat2">
          <div className="col-xs-6 info-cat" data-id={1} onClick={this.onInfoClick}>
            <p className=" text-center">我的提现</p>
          </div>
          <div className="col-xs-6 info-cat" data-id={2} onClick={this.onInfoClick}>
            <p className=" text-center">累计收益</p>
          </div>
        </div>
        <div className="bottom-border cat2">
          <div className="col-xs-6 info-cat" data-id={3} onClick={this.onInfoClick}>
            <p className=" text-center">访客记录</p>
          </div>
          <div className="col-xs-6 info-cat" data-id={4} onClick={this.onInfoClick}>
            <p className=" text-center">订单记录</p>
          </div>
        </div>
        <div className="bottom-border cat2">
          <div className="col-xs-6 info-cat" data-id={5} onClick={this.onInfoClick}>
            <p className=" text-center">活跃数值</p>
          </div>
          <div className="col-xs-6 info-cat" data-id={6} onClick={this.onInfoClick}>
            <p className=" text-center">我的粉丝 </p>
          </div>
        </div>
      </div>
    );
  }
}
