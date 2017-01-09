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
import * as boutiqueCouponAction from 'actions/mama/boutiqueCoupon';

import './index.scss';

const actionCreators = _.extend(mamaBaseInfoAction, boutiqueCouponAction);

@connect(
  state => ({
    mamaBaseInfo: state.mamaDetailInfo,
    boutiqueCoupon: state.boutiqueCoupon,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class BoutiqueExchg extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    mamaBaseInfo: React.PropTypes.any,
    fetchMamaLeader: React.PropTypes.func,
    fetchMamaTranCouponProfile: React.PropTypes.func,
    boutiqueCoupon: React.PropTypes.any,
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
    this.props.fetchMamaLeader();
    this.props.fetchMamaTranCouponProfile();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaLeader } = nextProps.mamaBaseInfo;
    const { mamaTranCouponProfile } = nextProps.boutiqueCoupon;

    if (mamaLeader.isLoading || mamaTranCouponProfile.isLoading) {
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
          this.context.router.push('/mama/boutiquecoupon');
          break;
        case '2':
          this.context.router.push('/mama/teammember');
          break;
        case '3':
          // window.location.href = constants.baseUrl + '/tran_coupon/html/trancoupon.html';
          this.context.router.push('/mama/inoutcoupon');
          break;
        case '4':
          this.context.router.push('/trancoupon/list');
          break;
        case '5':
          this.context.router.push('/mama/returncoupon/progress');
          break;
        case '6':
          this.context.router.push('/mama/exchgorder');
          break;
        case '7':
          this.context.router.push('/mama/recruit');
          break;
        default:
      }
    e.preventDefault();
  }

 enterEliteIntroduce = (e) => {
    this.context.router.push('/mama/elitemama');
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { mamaLeader } = this.props.mamaBaseInfo;
    const { mamaTranCouponProfile } = this.props.boutiqueCoupon;
    const hasHeader = !utils.detector.isApp();

    return (
      <div className="boutiqueexchg-container no-padding">
        <Header title="精品汇" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick} rightText="介绍" onRightBtnClick={this.enterEliteIntroduce} />
        <If condition={!hasHeader}>
          <div className="intro-div">
            <p className="intro-btn icon-yellow" onClick={this.enterEliteIntroduce}>精品汇介绍</p>
          </div>
        </If>
        <If condition={(mamaTranCouponProfile.success && mamaTranCouponProfile.data)}>
        <div className="elite-score bottom-border">
          <div className="elite-score-p">
            <span>{'我的ID:' + mamaTranCouponProfile.data.mama_id + ',总共购入' + mamaTranCouponProfile.data.bought_num + '张券,积分:'}</span>
            <span className="font-orange">{mamaTranCouponProfile.data.elite_score}</span>
            <span>{',还差' + mamaTranCouponProfile.data.upgrade_score + '积分升级。'}</span>
          </div>
          <div className="elite-score-p">
            <span>{'您现有'}</span>
            <span className="font-orange">{mamaTranCouponProfile.data.stock_num}</span>
            <span>{'张券可以使用。您目前有'}</span>
            <span className="font-orange">{mamaTranCouponProfile.data.waiting_in_num}</span>
            <span>{'张券等待被发放，有'}</span>
            <span className="font-orange">{mamaTranCouponProfile.data.waiting_out_num}</span>
            <span>{'张券等待您审核！'}</span>
          </div>
        </div>
        </If>
        <If condition={mamaLeader.success && mamaLeader.data && (mamaLeader.data.code === 0)}>
        <div className="mama-leader no-padding bottom-border">
          <div className="text-left leader-head">我的推荐人信息：</div>
          <div className="leader-info col-xs-12">
            <div className="col-xs-3">
              <img className="my-thumbnail" src ={(mamaLeader.success && mamaLeader.data) ? mamaLeader.data.thumbnail : ''} />
            </div>
            <div className="col-xs-9">
              <p className="my-mama-id">{'ID:' + ((mamaLeader.success && mamaLeader.data) ? mamaLeader.data.mama_id : '')}</p>
            </div>
            <div className="my-mama-level col-xs-9">
              <p className="text-left">{'昵称：' + ((mamaLeader.success && mamaLeader.data) ? mamaLeader.data.nick : '')}</p>
            </div>
            <div className="my-mama-level col-xs-9">
              <p className="text-left ">{'电话：' + ((mamaLeader.success && mamaLeader.data) ? mamaLeader.data.mobile : '')}</p>
            </div>
          </div>
          <div className="leader-foot bottom-border">小提示：入出券等操作都需要推荐妈妈支持，如长时间未处理可自行联系</div>
        </div>
        </If>
        <If condition={mamaLeader.success && mamaLeader.data && (mamaLeader.data.code === 0 || mamaLeader.data.code === 1 || mamaLeader.data.code === 3)}>
        <div className="bottom-border cat22">
          <div className="col-xs-6 info-cat no-padding" data-id={1} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="icon-xiaolu" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">我的精品券</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat no-padding" data-id={2} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="icon-xiaolu" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">精英团队</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat no-padding" data-id={3} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="icon-xiaolu" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">入券出券</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat no-padding" data-id={4} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="icon-xiaolu" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">买券</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat no-padding" data-id={5} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="icon-xiaolu" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">退券进展</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat no-padding" data-id={6} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="icon-xiaolu" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">订单兑券</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat no-padding" data-id={7} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="icon-xiaolu" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">招募妈妈</p>
            </div>
          </div>
        </div>
        </If>
        <If condition={mamaLeader.success && mamaLeader.data && (mamaLeader.data.code === 2 || mamaLeader.data.code === 4)}>
          <div className="rtn-info">{'提示：' + (mamaLeader.data.info)}</div>
          <div className="col-xs-offset-1">请点击右上角介绍按钮了解更多信息</div>
        </If>
      </div>
    );
  }
}
