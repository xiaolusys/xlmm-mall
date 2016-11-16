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

import pic11 from './images/messageImage.png';
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
      <div className="content mamainfo-container no-padding">
        <div className="my-level bottom-border">
          <div className="col-xs-3">
            <img className="my-thumbnail" src ={(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.extra_info.thumbnail : ''} />
          </div>
          <div className="col-xs-9">
            <p className="my-mama-id">{'ID:' + ((mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.mama_id : '')}</p>
          </div>
          <div className="my-mama-level no-padding col-xs-4">
            <div className="col-xs-1" >
              <div className="mama-diamonds-icon" />
            </div>
            <p className="text-left">{(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.mama_level_display : ''}</p>
          </div>
          <div className="my-mama-level no-padding col-xs-3">
            <div className="col-xs-1" >
              <div className="mama-crown-icon" />
            </div>
            <p className="text-left ">{(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.extra_info.agencylevel_display : 0}</p>
          </div>
        </div>
        <div className="bottom-border cat22">
          <div className="col-xs-6 info-cat" data-id={1} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="mama-cash-icon" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">我的提现</p>
              <p className=" ">{(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.cash_value : ''}</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat" data-id={2} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="mama-carryout-icon" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">累计收益</p>
              <p className=" ">{(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.carry_value : ''}</p>
            </div>
          </div>
        </div>
        <div className="bottom-border cat22">
          <div className="col-xs-6 info-cat left-border" data-id={3} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="mama-visitor-icon" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">访客记录</p>
              <p className=" ">{(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.today_visitor_num : ''}</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat" data-id={4} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="mama-orderlist-icon" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">订单记录</p>
              <p className=" ">{(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.order_num : ''}</p>
            </div>
          </div>
        </div>
        <div className="bottom-border cat22" style={{ marginTop: '20px' }}>
          <div className="col-xs-6 info-cat" data-id={5} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="mama-activenum-icon" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">活跃数值</p>
              <p className=" ">{(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.active_value_num : ''}</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat" data-id={6} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="mama-fans-icon" />
            </div>
            <div className="col-xs-9" >
              <p className="">我的粉丝 </p>
              <p className=" ">{(mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.fans_num : ''}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
