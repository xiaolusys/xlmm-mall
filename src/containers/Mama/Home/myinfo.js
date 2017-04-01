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
import * as mamaBaseInfoAction from 'actions/mama/mamaDetailInfo';

import pic11 from './images/messageImage.png';
import './myinfo.scss';

const actionCreators = _.extend(mamaBaseInfoAction);

@connect(
  state => ({
    mamaBaseInfo: state.mamaDetailInfo,
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

  onMakemoneyClick = (e) => {
    const { id } = e.currentTarget.dataset;
    const { mamaFortune } = this.props.mamaBaseInfo;
      switch (id) {
        case '1':
          this.context.router.push('/');
          break;
        case '2':
          this.context.router.push('/mama/everydaypush?mm_linkid=' + ((mamaFortune.success && mamaFortune.data.mama_fortune) ? mamaFortune.data.mama_fortune.mama_id : ''));
          break;
        case '3':
          this.context.router.push('/mama/commission');
          break;
        case '4':
          // this.context.router.push('/mama/invited');
          window.location.href = '/mall/boutiqueinvite';
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
        </div>
        <div className="bottom-border cat4">
            <div className="col-xs-3 makemoney-cat" data-id={1} onClick={this.onMakemoneyClick}>
              <div className="mama-shop-icon text-center" />
              <p className=" text-center">分享店铺</p>
            </div>
            <div className="col-xs-3 makemoney-cat" data-id={2} onClick={this.onMakemoneyClick}>
              <div className="mama-push-icon text-center" />
              <p className=" text-center">每日推送</p>
            </div>
            <div className="col-xs-3 makemoney-cat" data-id={3} onClick={this.onMakemoneyClick}>
              <div className="mama-select-icon text-center" />
              <p className=" text-center">选品佣金</p>
            </div>
            <div className="col-xs-3 makemoney-cat" data-id={4} onClick={this.onMakemoneyClick}>
              <div className="mama-invite-icon" />
              <p className=" text-center">邀请开店</p>
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
