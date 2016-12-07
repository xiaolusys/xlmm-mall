import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Link } from 'react-router';
import classnames from 'classnames';
import * as utils from 'utils';
import * as constants from 'constants';
import { If } from 'jsx-control-statements';
import { Loader } from 'components/Loader';
import { Header } from 'components/Header';
import { Timer } from 'components/Timer';
import { Image } from 'components/Image';
import { Dialog } from 'components/Dialog';
import * as boutiqueAction from 'actions/mama/boutiqueCoupon';
import * as couponAction from 'actions/user/coupons';

import './returnProgress.scss';

const actionCreators = _.extend(boutiqueAction, couponAction);

@connect(
  state => ({
    boutiqueCoupon: state.boutiqueCoupon,
    coupons: state.coupons,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class ReturnProgress extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    fetchMyReturnCoupon: React.PropTypes.func,
    fetchReturnCouponToMe: React.PropTypes.func,
    verifyReturnCoupon: React.PropTypes.func,
    boutiqueCoupon: React.PropTypes.any,
    coupons: React.PropTypes.any,
    returnFreezeCoupons: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    hasMore: true,
    pageIndex: 0,
    pageSize: 20,
    activeTab: 'default',
    sticky: false,
    isShowDialog: false,
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    this.props.fetchMyReturnCoupon(pageIndex + 1, pageSize);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { verifyReturnCoupon, returnFreeze } = this.props.boutiqueCoupon;
    let count = 0;
    let size = 0;
    let data = null;
    if (this.state.activeTab === 'default') {
      if (nextProps.boutiqueCoupon.myReturnCoupon.success) {
        data = nextProps.boutiqueCoupon.myReturnCoupon.data;
      }
    } else {
      if (nextProps.boutiqueCoupon.tomeReturnCoupon.success) {
        data = nextProps.boutiqueCoupon.tomeReturnCoupon.data;
      }
    }

    if (data) {
      count = data.count;
      size = data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }

    if (verifyReturnCoupon.isLoading || returnFreeze.isLoading) {
      if (this.state.activeTab === 'default') {
        this.props.fetchMyReturnCoupon();
      } else {
        this.props.fetchReturnCouponToMe();
      }
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
    this.setState({ pageIndex: 0 });
  }

  onTabItemClick = (e) => {
    const { type } = e.currentTarget.dataset;
    this.setState({
      activeTab: type,
      pageIndex: 0,
    });
    if (type === 'default') {
      this.props.fetchMyReturnCoupon();
    } else {
      this.props.fetchReturnCouponToMe();
    }
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const { fetchMyReturnCoupon, fetchReturnCouponToMe } = this.props;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.return-list-tabs');

    if (scrollTop === documentHeight - windowHeight && this.state.hasMore) {
      if (this.state.activeTab === 'default' && !this.props.boutiqueCoupon.myReturnCoupon.isLoading) {
        this.props.fetchMyReturnCoupon(pageIndex + 1, pageSize);
      }
      if (this.state.activeTab === 'tome' && !this.props.boutiqueCoupon.tomeReturnCoupon.isLoading) {
        this.props.fetchReturnCouponToMe(pageIndex + 1, pageSize);
      }
    }

    if (scrollTop > tabsOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  onCancelBtnClick = (e) => {
    this.setState({ isShowDialog: false });
    e.preventDefault();
  }

  onAgreeBtnClick = (e) => {
    this.props.returnFreezeCoupons(this.state.id);
    this.setState({ isShowDialog: false });
    e.preventDefault();
  }

  verifyClick = (e) => {
    const { id } = e.currentTarget.dataset;
    this.props.verifyReturnCoupon(id, 'agree');
  }

  confirmClick = (e) => {
    const { id } = e.currentTarget.dataset;
    this.setState({ isShowDialog: true, id: id });
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
        <div className="col-xs-3 member-img-div no-padding">
          <img className="col-xs-12 member-img no-padding" src={member.product_img} />
        </div>
        <div className="col-xs-9 member-detail no-padding">
          <div className="col-xs-12 no-padding">
            <p className="col-xs-8 text-left font-xs no-padding">{'发起人:' + member.from_mama_nick}</p>
            <p className="col-xs-8 text-left font-xs no-padding">{'接收人:' + member.to_mama_nick}</p>
          </div>
          <div className="col-xs-12 no-padding">
            <p className="col-xs-8 text-left font-xs no-padding">{'数量' + member.coupon_num + '张 ' + member.transfer_status_display}</p>
            <If condition={member.transfer_status === 1 && this.state.activeTab === 'tome'}>
              <button className="button button-sm button-light col-xs-3 font-xs return-btn no-padding" type="button" data-id={member.id} onClick={this.verifyClick} >审核</button>
            </If>
            <If condition={member.transfer_status === 2 && this.state.activeTab === 'default'}>
              <button className="button button-sm button-light col-xs-3 font-xs return-btn no-padding" type="button" data-id={member.id} onClick={this.confirmClick} >确认收钱</button>
            </If>
          </div>
          <div className="col-xs-12 no-padding">
            <p className="text-left font-xs no-padding">{member.date_field}</p>
          </div>
        </div>
      </li>
    );
  }

  render() {
    const { boutiqueCoupon } = this.props;
    const hasHeader = !utils.detector.isApp();
    const { activeTab, sticky } = this.state;

    let coupons = [];
    if (activeTab === 'default') {
      coupons = boutiqueCoupon.myReturnCoupon.data.results || [];
    } else {
      coupons = boutiqueCoupon.tomeReturnCoupon.data.results || [];
    }

    return (
      <div className="return-list">
        <Header title={'退券进展'} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} />
        <div className="content no-padding">
          <div className={'return-list-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
            <ul className="row no-margin">
              <li className={'col-xs-6' + (activeTab === 'default' ? ' active' : '')} data-type={'default'} onClick={this.onTabItemClick}>
                <div>我的退券</div>
              </li>
              <li className={'col-xs-6' + (activeTab === 'tome' ? ' active' : '')} data-type={'tome'} onClick={this.onTabItemClick}>
                <div>退券给我</div>
              </li>
            </ul>
          </div>
          <div className="return-list-p no-padding" >
          <If condition={coupons.length > 0}>
            <ul className="no-padding">
            {coupons.map((item, index) => this.renderMember(item, index)) }
            </ul>
          </If>
          </div>
        </div>
        <Dialog active={this.state.isShowDialog} title="小鹿提醒" content="您需要确认是否已经从推荐人收到券的 退款，点击同意确认收款，同时退的精品券转交给推荐人帐户。" onCancelBtnClick={this.onCancelBtnClick} onAgreeBtnClick={this.onAgreeBtnClick}/>
      </div>
    );
  }
}
