import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { wrapReactLifecycleMethodsWithTryCatch } from 'react-component-errors';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import { BottomBar } from 'components/BottomBar';
import { Radio } from 'components/Radio';
import { Checkbox } from 'components/Checkbox';
import { Popup } from 'components/Popup';
import { LogisticsPopup } from 'components/LogisticsPopup';
import { Toast } from 'components/Toast';
import classnames from 'classnames';
import * as constants from 'constants';
import * as utils from 'utils';
import * as plugins from 'plugins';
import pingpp from 'vendor/pingpp';
import _ from 'underscore';
import * as addressAction from 'actions/user/address';
import * as jimayOrderAction from 'actions/order/jimay';

import './index.scss';

const actionCreators = _.extend(addressAction, jimayOrderAction);

const payTypeIcons = {
  wx_pub: 'icon-wechat-pay icon-wechat-green',
  alipay_wap: 'icon-alipay-square icon-alipay-blue',
  wx: 'icon-wechat-pay icon-wechat-green',
  alipay: 'icon-alipay-square icon-alipay-blue',
};

@connect(
  state => {
    console.log('state1:', state);
    return {
      address: state.address,
      payInfo: state.jimayPayInfo,
      order: state.jimayOrder,
    };
  },
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
export default class JimayOrderApply extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    address: React.PropTypes.object,
    payInfo: React.PropTypes.object,
    order: React.PropTypes.object,
    fetchJimayOrderApplyInfo: React.PropTypes.func,
    fetchAddress: React.PropTypes.func,
    commitJimayOrder: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'order-confirm',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    order_num: 1,
    walletChecked: false,
    walletBalance: 0,
    logisticsCompanyId: '',
    logisticsCompanyName: '自动分配',
    payTypePopupActive: false,
    logisticsPopupShow: false,
    agreePurchaseTerms: true,
    isShowPurchaseTerms: false,
    commitOrderEnable: true,
    isAllVirtualProduct: false,
  }

  componentWillMount() {
    const { cartIds, addressId, couponId } = this.props.location.query;
    this.props.fetchAddress(addressId ? addressId : 'get_default_address');
    this.props.fetchJimayOrderApplyInfo(cartIds);
  }

  componentDidMount() {
    // this.props.resetCoupon();
  }

  componentWillReceiveProps(nextProps) {
    const { order, payInfo, address } = nextProps;
    const { router } = this.context;

    if (order.error && this.props.order.isLoading) {
      Toast.show('网络错误，请重试。');
      this.setState({ commitOrderEnable: true });
      return;
    }
    if (order.success && this.props.order.isLoading) {
      if (order.data.code !== 0) {
        this.setState({ commitOrderEnable: true });
        Toast.show(order.data.info);
      } else {
        window.location.replace('/jimay/order');
        return;
      }
    }

    if (payInfo.isLoading || order.isLoading || address.isLoading) {
      utils.ui.loadingSpinner.show();
    } else {
      utils.ui.loadingSpinner.hide();
    }
    if (payInfo.error) {
      Toast.show('需要微信打开授权登陆');
      // this.context.router.goBack();
    }
  }

  componentWillUnmount() {
    // this.props.resetCoupon();
  }

  onLinkClick = (e) => {
    this.context.router.push(e.currentTarget.dataset.to);
    e.preventDefault();
  }

  onCommitOrderClick = (e) => {
    const { address, payInfo } = this.props;

    if (!address.data.id && !this.state.isAllVirtualProduct) {
      Toast.show('请填写收货地址！');
      return;
    }

    if (!(payInfo && payInfo.success && payInfo.data)) {
      Toast.show('支付信息获取失败，请刷新此页面！');
      return;
    }

    this.setState({ commitOrderEnable: false });
    this.props.commitJimayOrder({
      order_no: payInfo.data.order_no,
      sku_id: payInfo.data.item.sku_id,
      model_id: payInfo.data.item.model_id,
      num: this.state.order_num,
      address: address.data.id,
    });
    return;
  }

  onUpdateQuantityClick = (e) => {
    const { action, id } = e.currentTarget.dataset;
    if (action === 'minus' && Number(this.state.order_num) === 1) {
      Toast.show('购买数量不能为0');
      e.preventDefault();
      return false;
    }
    switch (action) {
      case 'plus':
        this.setState({ order_num: this.state.order_num + 1 });
        break;
      case 'minus':
        this.setState({ order_num: this.state.order_num - 1 });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onShowPurchaseItermsClick = (e) => {
    return;
  }

  getChannel = () => {
    return [];
  }

  getDisplayPrice = (p) => {
    return 0;
  }

  get_totalfee = (e) => {
    if (this.props.payInfo.success) {
      return (this.state.order_num * this.props.payInfo.data.item.agent_price).toFixed(2);
    }
    return 0;
  }

  renderProducts(products = []) {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-product-list`}>
        {products.map((product, index) => {
          return (
            <div key={product.model_id} className="row no-margin bottom-border">
              <div className="col-xs-3 no-padding">
                <img src={product.pic_path + constants.image.square} />
              </div>
              <div className="col-xs-9 no-padding padding-top-xxs font-xs">
                <p className="row no-margin no-wrap">{product.title}</p>
                <p className="row no-margin margin-top-xxxs font-grey">{'规格: ' + product.sku_name}</p>
                <p className="row no-margin margin-top-xxxs">
                  <span className="">{'￥' + product.agent_price.toFixed(2)}</span>
                  <span className="pull-right cart-quantity">
                    <i className="icon-minus icon-yellow" data-action="minus" data-id={product.model_id} data-num={product.num} onClick={this.onUpdateQuantityClick}></i>
                    <span>{this.state.order_num}</span>
                    <i className="icon-plus icon-yellow" data-action="plus" data-id={product.model_id} data-num={product.num} onClick={this.onUpdateQuantityClick}></i>
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { prefixCls, payInfo, order } = this.props;
    const products = payInfo.data.item && [payInfo.data.item] || [];
    const item = payInfo.data.item || { total_fee: 0, post_fee: 0 };
    const logisticsCompanies = payInfo.data.logistics_companys || [];
    const payExtras = payInfo.data.pay_extras || [];
    const address = this.props.address.data || {};
    const isAllVirtualProduct = false;
    const channels = this.getChannel();
    const { pathname, query } = this.props.location;
    const addressLink = '/user/address?source_type=' + ((payInfo && payInfo.data) ? payInfo.data.max_personalinfo_level : 0)
                    + '&next=' + encodeURIComponent(pathname + '?'
                    + (query.cartIds ? '&cartIds=' + query.cartIds : '')
                    + (query.teambuyId ? '&teambuyId=' + query.teambuyId : '')
                    + (query.mm_linkid ? '&mm_linkid=' + query.mm_linkid : '')
                    + (query.couponId ? '&couponId=' + query.couponId : ''));

    return (
      <div className={`${prefixCls}`}>
        <Header title="订货申请" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content">
          <If condition={!isAllVirtualProduct}>
          <div className={`row no-margin bottom-border ${prefixCls}-address`} data-to={addressLink} onClick={this.onLinkClick}>
            <If condition={!_.isEmpty(address)}>
              <i className="col-xs-1 no-padding margin-top-xxs icon-location icon-2x icon-yellow-light"></i>
              <div className="col-xs-10">
                <p><span className="margin-right-sm">{address.receiver_name}</span><span>{address.receiver_mobile}</span></p>
                <p className="font-grey-light">{address.receiver_state + address.receiver_city + address.receiver_district + address.receiver_address}</p>
              </div>
              <i className="col-xs-1 no-padding margin-top-28 text-right icon-angle-right icon-grey"></i>
            </If>
            <If condition={_.isEmpty(address)}>
              <i className="col-xs-1 no-padding icon-location icon-2x icon-yellow-light"></i>
              <div className="col-xs-10 margin-top-xxs">填写收货地址</div>
              <i className="col-xs-1 no-padding margin-top-xxs text-right icon-angle-right icon-grey"></i>
            </If>
          </div>
          </If>
          {this.renderProducts(products)}
          <div className={`row no-margin ${prefixCls}-row transparent`}>
            <p className="col-xs-12 no-padding">
              <span className="col-xs-9 no-padding text-left">参考总价(具体价格需管理员审核后显示)</span>
              <span className="col-xs-3 no-padding text-right font-orange">{'￥' + this.get_totalfee() }</span>
            </p>
            <p className="col-xs-12 margin-top-xxs no-padding">
              <span className="col-xs-5 no-padding text-left">运费</span>
              <span className="col-xs-7 no-padding text-right">{'￥' + item.post_fee}</span>
            </p>
          </div>
        </div>
        <BottomBar size="large">
          <p>
            <span className="font-xs">订货金额需管理员审核后显示</span>
            <span className="font-lg font-orange">{'￥' + this.getDisplayPrice(payInfo.data.total_payment)}</span>
          </p>
          <button className="button button-energized col-xs-12" type="button" onClick={this.onCommitOrderClick} disabled={!this.state.commitOrderEnable}>确认订货</button>
        </BottomBar>
        <Popup active={this.state.isShowPurchaseTerms}>
          <p className="font-md text-center">购买条款</p>
          <p className="font-xs">
            亲爱的小鹿用户，由于特卖商城购买人数过多和供应商供货原因，可能存在极少数用户出现缺货的情况。
          </p>
          <p className="font-xs">
            为了减少您长时间的等待，一旦出现这种情况，我们将在您购买一周后帮您自动退款，并补偿给您一张为全场通用优惠劵。
          </p>
          <p className="font-xs">
            质量问题退货会以现金券或小鹿余额形式补偿10元邮费。
          </p>
          <p className="font-xs">
           订单向外贸工厂订货后无法退款，需要收货后走退货流程或者换货。
          </p>
          <p className="font-xs">
            给您带来不便，敬请谅解！祝您购物愉快！本条款解释权归小鹿美美特卖商城所有。
          </p>
          <div className="row no-margin">
            <button className="col-xs-10 col-xs-offset-1 margin-top-xs button button-sm button-energized" type="button" onClick={this.onShowPurchaseItermsClick} disabled={this.state.save}>确定</button>
          </div>
        </Popup>
        <LogisticsPopup active={this.state.logisticsPopupShow} companies={logisticsCompanies} onItemClick={this.onLogisticsCompanyChange} onColsePopupClick={this.onColseLogisticsPopupClick}/>
      </div>
    );
  }
}
