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
    mamaBaseInfo: state.mamaBaseInfo,
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
          window.location.href = constants.baseUrl + '/tran_coupon/html/trancoupon.html';
          break;
        case '4':
          window.location.href = constants.baseUrl + '/tran_coupon/html/trancoupon.html';
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
        <Header title="精品汇" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick} rightText="介绍" onRightBtnClick={this.enterEliteIntroduce} hide={!hasHeader}/>
        <If condition={!hasHeader}>
          <div className="intro-div">
            <button className="intro-btn icon-yellow" onClick={this.enterEliteIntroduce}>精品汇介绍</button>
          </div>
        </If>
        <div className="elite-score">
          <p className="elite-score-p">{'我的积分:' + ((mamaTranCouponProfile.success && mamaTranCouponProfile.data) ? mamaTranCouponProfile.data.elite_score : '')}</p>
        </div>
        <If condition={mamaLeader.success && mamaLeader.data && (mamaLeader.data.code === 0)}>
        <div className="mama-leader no-padding bottom-border">
          <div className="text-left leader-head">我的上级信息：</div>
          <div className="leader-info">
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
          <div className="leader-foot bottom-border">小提示：入出券等操作都需要上级妈妈支持，如长时间未处理可自行联系</div>
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
              <p className=" ">入券</p>
            </div>
          </div>
          <div className="col-xs-6 info-cat no-padding" data-id={4} onClick={this.onInfoClick}>
            <div className="col-xs-3" >
              <div className="icon-xiaolu" />
            </div>
            <div className="col-xs-9" >
              <p className=" ">出券</p>
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
