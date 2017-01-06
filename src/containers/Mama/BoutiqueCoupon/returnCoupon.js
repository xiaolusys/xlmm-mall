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
import { Toast } from 'components/Toast';
import * as boutiqueCouponAction from 'actions/mama/boutiqueCoupon';
import * as userCouponAction from 'actions/user/coupons';

import './returnCoupon.scss';

const actionCreators = _.extend(boutiqueCouponAction, userCouponAction);

@connect(
  state => ({
    boutiqueCoupon: state.boutiqueCoupon,
    coupons: state.coupons,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class ReturnBoutiqueCoupon extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    location: React.PropTypes.object,
    boutiqueCoupon: React.PropTypes.any,
    fetchMamaLeftTranCoupon: React.PropTypes.func,
    coupons: React.PropTypes.any,
    applyReturnCoupons: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    num: 1,
    returnEnable: true,
  }

  componentWillMount() {
    const { unusedBoutique } = this.props.coupons;
    const { index, type } = this.props.location.query;

    if (unusedBoutique && Number(index) >= 0) {
      const coupon = unusedBoutique.data[Number(index)];
      this.setState({ coupon: coupon, type: type });
    }
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaLeftTranCoupon } = this.props.boutiqueCoupon;
    const { applyReturn } = this.props.coupons;

    if (applyReturn.isLoading) {
      utils.ui.loadingSpinner.show();
    }

    if (!nextProps.coupons.applyReturn.isLoading) {
      utils.ui.loadingSpinner.hide();
      if (nextProps.coupons.applyReturn.success && nextProps.coupons.applyReturn.data) {
        Toast.show(nextProps.coupons.applyReturn.data.info);
        this.setState({ returnEnable: true });
        if (nextProps.coupons.applyReturn.data.code === 0) {
          this.context.router.replace('/mama/returncoupon/progress');
        }
      }
      if (!nextProps.coupons.applyReturn.success) {
        Toast.show('申请失败 ');
        this.setState({ returnEnable: true });
      }
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

  onUpdateQuantityClick = (e) => {
    const { action } = e.currentTarget.dataset;
    if (action === 'minus' && Number(this.state.num) === 1) {
      e.preventDefault();
      return false;
    }

    switch (action) {
      case 'plus':
        if (Number(this.state.num + 1) > this.state.coupon.coupon_num) {
          Toast.show('特卖商品券退券个数不能大于拥有张数' + this.state.coupon.coupon_num + '张');
          break;
        }
        this.setState({ num: this.state.num + 1 });
        break;
      case 'minus':
        this.setState({ num: this.state.num - 1 });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onNumChange = (value) => {
    if (Number(value.target.value) === 0) {
      Toast.show('输入个数不能为0');
      return;
    }

    if ((Number(value.target.value) > 0)
        && Number(value.target.value) > this.state.coupon.coupon_num) {
      Toast.show('特卖商品券退券个数不能大于拥有张数' + this.state.coupon.coupon_num + '张');
      return;
    }

    this.setState({ num: Number(value.target.value) });
  }

  onReturnClick = (e) => {
    if (this.state.type === 'indirect') {
      const coupons = this.state.coupon.from_mama_coupon_ids.slice(0, this.state.num);
      let params = '';
      for (let i = 0; i < coupons.length; i++) {
        params += coupons[i];
        if (i < coupons.length - 1) {
          params += ',';
        }
      }
      this.props.applyReturnCoupons(params, 'upper_mama');
    } else if (this.state.type === 'direct') {
      const coupons = this.state.coupon.from_sys_coupon_ids.slice(0, this.state.num);
      let params = '';
      for (let i = 0; i < coupons.length; i++) {
        params += coupons[i];
        if (i < coupons.length - 1) {
          params += ',';
        }
      }
      this.props.applyReturnCoupons(params, 'sys');
    }
    this.setState({ returnEnable: false });
    e.preventDefault();
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderMember = (member) => {

    return (
      <div className="member-item no-padding" >
        <div className=" member-img-div no-padding">
          <Image className=" member-img no-padding" src={member.product_img} quality={70}/>
          <If condition={ this.state.type === 'indirect' }>
            <p className=" member-num text-center no-padding">{'共拥有' + member.from_mama_coupon_ids.length + '张'}</p>
          </If>
          <If condition={ this.state.type === 'direct' }>
            <p className=" member-num text-center no-padding">{'共拥有' + member.from_sys_coupon_ids.length + '张'}</p>
          </If>
        </div>
        <div className=" coupon-num col-xs-12">
          <div className="text-center cart-quantity">
            <i className="icon-minus icon-yellow" data-action="minus" onClick={this.onUpdateQuantityClick}></i>
            <input className="input-num" type="number" value={this.state.num} required pattern="[1-9][0-9]*$" onChange={this.onNumChange} />
            <i className="icon-plus icon-yellow" data-action="plus" onClick={this.onUpdateQuantityClick}></i>
          </div>
        </div>
        <div>
          <p className="col-xs-offset-1">规则说明：精品优惠券退券只能退本级别购买的券。如需退更多的券，涉及到您的等级和积分降低，需要联系客服处理。</p>
        </div>
        <div className="row no-margin text-center margin-bottom-xs">
          <button className="col-xs-10 col-xs-offset-1 button button-energized" onClick={this.onReturnClick} disabled={!this.state.returnEnable}>申请退券</button>
        </div>
      </div>
    );
  }

  render() {

    return (
      <div className="returncoupon-container no-padding">
        <Header title="退精品券" leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick}/>
        <div className="tran-coupons bg-white no-padding">
          <If condition={this.state.coupon}>
            { this.renderMember(this.state.coupon) }
          </If>
        </div>
      </div>
    );
  }
}
