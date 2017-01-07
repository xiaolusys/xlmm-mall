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
import { Toast } from 'components/Toast';
import * as boutiqueAction from 'actions/mama/boutiqueCoupon';

import './inoutCoupon.scss';

const actionCreators = _.extend(boutiqueAction);

@connect(
  state => ({
    boutiqueCoupon: state.boutiqueCoupon,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class InOutCoupon extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    fetchMyInCoupon: React.PropTypes.func,
    resetMyInCoupon: React.PropTypes.func,
    resetMyOutCoupon: React.PropTypes.func,
    fetchMyOutCoupon: React.PropTypes.func,
    boutiqueCoupon: React.PropTypes.any,
    fetchMamaTranCouponProfile: React.PropTypes.func,
    cancelTransferCoupon: React.PropTypes.func,
    sendTransferCoupon: React.PropTypes.func,
    processTransferCoupon: React.PropTypes.func,
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
    pageSize: 10,
    activeTab: 'default',
    sticky: false,
    isCancelShowDialog: false,
    isSendShowDialog: false,
    isProcessShowDialog: false,
    status: 0,
    btnEnable: true,
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    this.props.fetchMyInCoupon(this.state.status, pageIndex + 1, pageSize);
    this.props.fetchMamaTranCouponProfile();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { cancelTransfer, sendTransfer, processTransfer } = this.props.boutiqueCoupon;
    let count = 0;
    let size = 0;
    let data = null;
    if (this.state.activeTab === 'default') {
      if (nextProps.boutiqueCoupon.myInCoupon.success) {
        data = nextProps.boutiqueCoupon.myInCoupon.data;
      }
    } else {
      if (nextProps.boutiqueCoupon.myOutCoupon.success) {
        data = nextProps.boutiqueCoupon.myOutCoupon.data;
      }
    }

    if (data) {
      count = data.count;
      size = data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }

    if (cancelTransfer.isLoading || sendTransfer.isLoading || processTransfer.isLoading) {
      if (nextProps.boutiqueCoupon.cancelTransfer.success && nextProps.boutiqueCoupon.cancelTransfer.data) {
        Toast.show(nextProps.boutiqueCoupon.cancelTransfer.data.info);
      }
      if (nextProps.boutiqueCoupon.sendTransfer.success && nextProps.boutiqueCoupon.sendTransfer.data) {
        Toast.show(nextProps.boutiqueCoupon.sendTransfer.data.info);
      }
      if (nextProps.boutiqueCoupon.processTransfer.success && nextProps.boutiqueCoupon.processTransfer.data) {
        Toast.show(nextProps.boutiqueCoupon.processTransfer.data.info);
      }

      if (this.state.activeTab === 'default') {
        this.props.resetMyInCoupon();
        this.props.fetchMyInCoupon(this.state.status, 1, this.state.pageSize);
      } else {
        this.props.resetMyOutCoupon();
        this.props.fetchMyOutCoupon(this.state.status, 1, this.state.pageSize);
      }
      this.setState({ btnEnable: true });
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
      status: 0,
      rselected: 0,
    });
    if (type === 'default') {
      this.props.resetMyInCoupon();
      this.props.fetchMyInCoupon(0, 1, this.state.pageSize);
    } else {
      this.props.resetMyOutCoupon();
      this.props.fetchMyOutCoupon(0, 1, this.state.pageSize);
    }
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.return-list-tabs');

    if (scrollTop === documentHeight - windowHeight && this.state.hasMore) {
      if (this.state.activeTab === 'default' && !this.props.boutiqueCoupon.myInCoupon.isLoading) {
        this.props.fetchMyInCoupon(this.state.status, pageIndex + 1, pageSize);
      }
      if (this.state.activeTab === 'out' && !this.props.boutiqueCoupon.myOutCoupon.isLoading) {
        this.props.fetchMyOutCoupon(this.state.status, pageIndex + 1, pageSize);
      }
    }

    if (scrollTop > tabsOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  onCancelBtnClick = (e) => {
    if (this.state.isCancelShowDialog) {
      this.setState({ isCancelShowDialog: false, btnEnable: true });
    } else if (this.state.isSendShowDialog) {
      this.setState({ isSendShowDialog: false, btnEnable: true });
    } else if (this.state.isProcessShowDialog) {
      this.setState({ isProcessShowDialog: false, btnEnable: true });
    }
    e.preventDefault();
  }

  onAgreeBtnClick = (e) => {
    if (this.state.isCancelShowDialog) {
      this.props.cancelTransferCoupon(this.state.id);
      this.setState({ isCancelShowDialog: false });
    } else if (this.state.isSendShowDialog) {
      this.props.sendTransferCoupon(this.state.id);
      this.setState({ isSendShowDialog: false });
    } else if (this.state.isProcessShowDialog) {
      this.props.processTransferCoupon(this.state.id);
      this.setState({ isProcessShowDialog: false });
    }
    e.preventDefault();
  }

  transferOutClick = (e) => {
    const { id } = e.currentTarget.dataset;
    this.setState({ isSendShowDialog: true, id: id, btnEnable: false });
  }

  verifyOutClick = (e) => {
    const { id } = e.currentTarget.dataset;
    this.setState({ isProcessShowDialog: true, id: id, btnEnable: false });
  }

  cancelInClick = (e) => {
    const { id } = e.currentTarget.dataset;
    this.setState({ isCancelShowDialog: true, id: id, btnEnable: false });
  }

  selectChange = (event) => {
    this.setState({ status: Number(event.target.value), rselected: event.target.value });
    if (this.state.activeTab === 'default') {
      this.props.resetMyInCoupon();
      this.props.fetchMyInCoupon(Number(event.target.value), 1, this.state.pageSize);
    } else {
      this.props.resetMyOutCoupon();
      this.props.fetchMyOutCoupon(Number(event.target.value), 1, this.state.pageSize);
    }
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
        <div className="col-xs-9 member-detail no-padding no-margin">
          <div className="col-xs-12 no-padding no-margin">
            <p className="col-xs-8 text-left font-xs no-padding no-margin">{'发放人:' + member.from_mama_nick}</p>
            <p className="col-xs-8 text-left font-xs no-padding no-margin">{'接收人:' + member.to_mama_nick}</p>
          </div>
          <div className="col-xs-12 no-padding no-margin">
            <p className="col-xs-7 text-left font-xs no-padding no-margin">{'数量' + member.coupon_num + '张 ' + member.transfer_status_display}</p>
            <If condition={this.state.activeTab === 'out'}>
              <Choose>
              <When condition={member.is_buyable}>
                <button className="button button-sm button-light col-xs-4 font-xs return-btn no-padding no-margin" type="button" data-id={member.id} onClick={this.transferOutClick} disabled={!this.state.btnEnable}>发放</button>
              </When>
              <When condition={member.is_processable}>
                <button className="button button-sm button-light col-xs-4 font-xs return-btn no-padding no-margin" type="button" data-id={member.id} onClick={this.verifyOutClick} disabled={!this.state.btnEnable}>审核</button>
              </When>
              </Choose>
            </If>
            <If condition={member.is_cancelable && this.state.activeTab === 'default'}>
              <button className="button button-sm button-light col-xs-4 font-xs return-btn no-padding no-margin" type="button" data-id={member.id} onClick={this.cancelInClick} disabled={!this.state.btnEnable}>取消</button>
            </If>
          </div>
          <div className="col-xs-12 no-padding no-margin">
            <p className="text-left font-xs no-padding no-margin">{member.created.replace('T', ' ')}</p>
          </div>
        </div>
      </li>
    );
  }

  render() {
    const { boutiqueCoupon } = this.props;
    const { mamaTranCouponProfile } = this.props.boutiqueCoupon;
    const hasHeader = !utils.detector.isApp();
    const { activeTab, sticky } = this.state;

    let coupons = [];
    if (activeTab === 'default') {
      coupons = boutiqueCoupon.myInCoupon.data.results || [];
    } else {
      coupons = boutiqueCoupon.myOutCoupon.data.results || [];
    }

    return (
      <div className="inoutcoupon-list">
        <Header title={'入券出券'} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} />
        <div className="content no-padding">
          <If condition={(mamaTranCouponProfile.success && mamaTranCouponProfile.data)}>
          <div className="elite-score bottom-border">
            <div className="elite-score-p">
              <span>{'我的ID:' + mamaTranCouponProfile.data.mama_id + ',总共购入' + mamaTranCouponProfile.data.bought_num + '张券。'}</span>
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
          <div className={'return-list-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
            <ul className="row no-margin">
              <li className={'col-xs-4' + (activeTab === 'default' ? ' active' : '')} data-type={'default'} onClick={this.onTabItemClick}>
                <div>入券</div>
              </li>
              <li className={'col-xs-4' + (activeTab === 'out' ? ' active' : '')} data-type={'out'} onClick={this.onTabItemClick}>
                <div>出券</div>
              </li>
              <li className="col-xs-4">
                <select className="select col-xs-10" value={this.state.rselected} onChange={this.selectChange}>
                    <option value="0">全部</option>
                    <option value="1">待审核</option>
                    <option value="2">待发放</option>
                    <option value="3">已完成</option>
                    <option value="4">已取消</option>
                </select>
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
        <Dialog active={this.state.isCancelShowDialog} title="小鹿提醒" content="您确定取消精品券申请么？点击同意确认。" onCancelBtnClick={this.onCancelBtnClick} onAgreeBtnClick={this.onAgreeBtnClick}/>
        <Dialog active={this.state.isSendShowDialog} title="小鹿提醒" content="您务必先收款后发券，点击同意确认收款。" onCancelBtnClick={this.onCancelBtnClick} onAgreeBtnClick={this.onAgreeBtnClick}/>
        <Dialog active={this.state.isProcessShowDialog} title="小鹿提醒" content="您务必先收款后发券，点击同意确认收款。" onCancelBtnClick={this.onCancelBtnClick} onAgreeBtnClick={this.onAgreeBtnClick}/>
      </div>
    );
  }
}
