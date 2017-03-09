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
import { Coupon } from 'components/Coupon';
import * as boutiqueCouponAction from 'actions/mama/boutiqueCoupon';
import * as userCouponAction from 'actions/user/coupons';

import './boutiqueCoupon.scss';

const actionCreators = _.extend(boutiqueCouponAction, userCouponAction);

@connect(
  state => ({
    boutiqueCoupon: state.boutiqueCoupon,
    coupons: state.coupons,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class BoutiqueCoupon extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    boutiqueCoupon: React.PropTypes.any,
    fetchMamaLeftTranCoupon: React.PropTypes.func,
    coupons: React.PropTypes.any,
    fetchUnusedBoutiqueCoupons: React.PropTypes.func,
    fetchFreezedBoutiqueCoupons: React.PropTypes.func,
    resetUnusedBoutiqueCoupons: React.PropTypes.func,
    resetFreezedBoutiqueCoupons: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    pageIndex: 0,
    pageSize: 10,
    sticky: false,
    hasMore: false,
    activeTab: 'default',
  }

  componentWillMount() {
    this.props.fetchUnusedBoutiqueCoupons();
    this.props.fetchFreezedBoutiqueCoupons(1);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaLeftTranCoupon } = this.props.boutiqueCoupon;
    const { unusedBoutique } = this.props.coupons;
    let count = 0;
    let size = 0;
    let data = null;

    if (mamaLeftTranCoupon.isLoading || unusedBoutique.isLoading) {
      utils.ui.loadingSpinner.show();
    }

    if (!nextProps.boutiqueCoupon.mamaLeftTranCoupon.isLoading && !nextProps.coupons.unusedBoutique.isLoading) {
      utils.ui.loadingSpinner.hide();
    }

    if (this.state.activeTab === 'freezed') {
      if (nextProps.coupons.freezedBoutique.success) {
        data = nextProps.coupons.freezedBoutique.data;
      }
    }

    if (data) {
      count = data.count;
      size = data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onTabItemClick = (e) => {
    const { type } = e.currentTarget.dataset;
    this.setState({
      activeTab: type,
      pageIndex: 0,
      status: 0,
      rselected: 0,
    });
    if (type === 'default') {
      this.props.resetUnusedBoutiqueCoupons();
      this.props.fetchUnusedBoutiqueCoupons();
    } else {
      this.props.resetFreezedBoutiqueCoupons();
      this.props.fetchFreezedBoutiqueCoupons(1);
    }
  }

  onScroll = (e) => {
    const { freezedBoutique } = this.props.coupons;
    const { pageSize, pageIndex, activeTab } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.return-list-tabs');

    if (this.state.activeTab === 'freezed') {
      if (scrollTop === documentHeight - windowHeight && !freezedBoutique.isLoading && this.state.hasMore) {
        this.props.fetchFreezedBoutiqueCoupons(pageIndex + 1);
      }
    }

    if (scrollTop > tabsOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  onLeftBtnClick = (e) => {
    this.context.router.goBack();
  }

  directReturnClick = (e) => {
    const { index, type } = e.currentTarget.dataset;
    this.context.router.push('/mama/returncoupon/?index=' + index + '&type=' + type);
    e.preventDefault();
  }

  imgClick = (e) => {
    const { modelid } = e.currentTarget.dataset;
    this.context.router.push('/buycoupon?modelid=' + modelid);
    e.preventDefault();
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderMember = (member, index) => {

    return (
      <li key={index} className="col-xs-12 member-item bottom-border no-padding" data-index={index} >
        <div className="col-xs-12 member-title-div font-xs">
          {member.title.substring(0, 27)}
        </div>
        <div className="col-xs-3 member-img-div no-padding">
          <img className="col-xs-12 member-img no-padding" src={member.product_img} data-modelid={member.product_model_id} onClick={this.imgClick} />
          <p className="col-xs-12 member-num text-center no-padding">{member.coupon_num + '张'}</p>
        </div>
        <div className="col-xs-9 member-detail no-padding">
          <div className="col-xs-12 bottom-border no-padding">
            <p className="col-xs-8 text-left font-xs no-padding">{'直接购买 ' + member.from_sys_coupon_ids.length + '张'}</p>
            <If condition={ member.can_return_upper && member.from_sys_coupon_ids.length > 0 }>
              <button className="button button-sm button-light col-xs-3 font-xs return-btn no-padding" type="button" data-type={'direct'} data-index={index} onClick={this.directReturnClick} >退券</button>
            </If>
          </div>
          <div className="col-xs-12 bottom-border no-padding">
            <p className="col-xs-8 text-left font-xs no-padding">{'推荐人转券 ' + member.from_mama_coupon_ids.length + '张'}</p>
            <If condition={member.can_return_upper && member.from_mama_coupon_ids.length > 0 }>
              <button className="button button-sm button-light col-xs-3 font-xs return-btn no-padding" type="button" data-type={'indirect'} data-index={index} onClick={this.directReturnClick} >退券</button>
            </If>
          </div>
          <div className="col-xs-12 no-padding">
            <If condition={member.gift_transfer_coupon_ids.length > 0}>
            <p className="text-left font-xs no-padding">{'赠送券 ' + member.gift_transfer_coupon_ids.length + '张'}</p>
            </If>
          </div>
        </div>
      </li>
    );
  }

  renderFreezedMember = (member, index) => {
    return (
      <li key={index} className="col-xs-12 member-item bottom-border no-padding" data-index={index} >
          <Coupon status={'available'} couponItem={member} key={index} data-status={member.status} data-id={member.id} />
      </li>
    );
  }

  render() {
    const { unusedBoutique, freezedBoutique } = this.props.coupons;
    const { activeTab, sticky } = this.state;
    let unusedNum = 0;
    if (activeTab === 'default' && unusedBoutique.success && unusedBoutique.data && unusedBoutique.data.length > 0) {
      for (let i = unusedBoutique.data.length - 1; i >= 0; i--) {
        unusedNum += unusedBoutique.data[i].coupon_num;
      }
    }

    return (
      <div className="boutiquecoupon-container no-padding">
        <Header title="我的精品券" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="jump-div bg-white">
          <p className="font-blue font-xs" >说明：提交退券申请后，券会被暂时冻结，退券流程处理完进行转移和解冻。客户退货后，如果订单使用券兑换，扣除您个人帐户兑换金额时金额不足会暂时冻结券，帐户恢复后自动解冻。</p>
        </div>
        <div className={'return-list-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + 'has-header' }>
          <ul className="row no-margin">
            <li className={'col-xs-6' + (activeTab === 'default' ? ' active' : '')} data-type={'default'} onClick={this.onTabItemClick}>
              <div>{'可使用(' + (unusedNum) + ')'}</div>
            </li>
            <li className={'col-xs-6' + (activeTab === 'freezed' ? ' active' : '')} data-type={'freezed'} onClick={this.onTabItemClick}>
              <div>{'已冻结(' + ((freezedBoutique.success && freezedBoutique.data) ? freezedBoutique.data.results.length : 0) + ')'}</div>
            </li>
          </ul>
        </div>
        <div className="tran-coupons bg-white no-padding">
            <ul className="col-xs-12 no-padding tran-ul">
            <If condition={activeTab === 'default' && unusedBoutique.success && unusedBoutique.data && unusedBoutique.data.length > 0}>
            {unusedBoutique.data.map((item, index) => this.renderMember(item, index))
            }
            </If>
            <If condition={activeTab === 'freezed' && freezedBoutique.success && freezedBoutique.data && freezedBoutique.data.results.length > 0}>
            {freezedBoutique.data.results.map((item, index) => this.renderFreezedMember(item, index))
            }
            </If>
            </ul>
          <If condition={activeTab === 'default' && unusedBoutique.success && unusedBoutique.data && unusedBoutique.data.length === 0}>
            <div className="no-coupon-members bg-white">
              <p className=" font-xs" >您没有任何精品券剩余，赶紧去逛逛吧</p>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
