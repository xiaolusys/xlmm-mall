import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as constants from 'constants';
import * as actionCreators from 'actions/shopBag';
import { Header } from 'components/Header';
import { Loader } from 'components/Loader';
import { BottomBar } from 'components/BottomBar';

import './index.scss';

@connect(
  state => ({
    shopBag: state.shopBag,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class ShopBag extends Component {
  static propTypes = {
    shopBag: React.PropTypes.object,
    fetchShopBag: React.PropTypes.func,
    fetchShopBagHistory: React.PropTypes.func,
    updateQuantity: React.PropTypes.func,
    rebuy: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {}

  componentWillMount() {
    this.props.fetchShopBag();
    this.props.fetchShopBagHistory();
  }

  onRebuyClick = (e) => {
    const { itemid, cartid, skuid } = e.currentTarget.dataset;
    this.props.rebuy(itemid, skuid, cartid);
  }

  onBuyNowClick = (e) => {
    const { shopBag } = this.props.shopBag;
    const cartIds = [];
    _.each(shopBag.data, (item) => {
      cartIds.push(item.id);
    });
    window.location.href = '/pages/queren-dd.html?cart_ids=' + encodeURIComponent(cartIds.join(','));
    // this.context.router.push('/order/commit/' + encodeURIComponent(cartIds.join(',')));
  }

  onUpdateQuantityClick = (e) => {
    const { action, id, num } = e.currentTarget.dataset;
    if (action === 'minus' && Number(num) === 1) {
      this.props.updateQuantity(id, 'delete_carts');
      e.preventDefault();
      return false;
    }
    switch (action) {
      case 'plus':
        this.props.updateQuantity(id, 'plus_product_carts');
        break;
      case 'minus':
        this.props.updateQuantity(id, 'minus_product_carts');
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  totalPrice = () => {
    const { shopBag } = this.props.shopBag;
    let totalPrice = 0;
    _.each(shopBag.data, (item) => {
      totalPrice += item.total_fee;
    });
    return totalPrice.toFixed(2);
  }

  render() {
    const { shopBag, shopBagHistory } = this.props.shopBag;

    return (
      <div>
        <Header title="购物车" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content shop-bag-container">
          <If condition={!_.isEmpty(shopBag.data) || shopBag.isLoading}>
            <ul className="shop-bag-list shop-bag-list-white-bg">
              {shopBag.isLoading ? <Loader/> : null}
              {_.isEmpty(shopBag.data) ? null : shopBag.data.map((item) => {
                return (
                  <li key={item.id} className="row no-margin bottom-border">
                    <div className="col-xs-4">
                      <img src={item.pic_path + constants.image.square} />
                    </div>
                    <div className="col-xs-8">
                      <p className="no-wrap">{item.title}</p>
                      <p className="font-xs font-grey-light">{item.sku_name}</p>
                      <p>
                        <span className="font-lg font-orange">{'￥' + item.price}</span>
                        <span className="font-grey-light">{'/￥' + item.std_sale_price}</span>
                        <span className="pull-right cart-quantity">
                          <i className="icon-minus icon-yellow" data-action="minus" data-id={item.id} data-num={item.num} onClick={this.onUpdateQuantityClick}></i>
                          <span>{item.num}</span>
                          <i className="icon-plus icon-yellow" data-action="plus" data-id={item.id} data-num={item.num} onClick={this.onUpdateQuantityClick}></i>
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </If>
          <If condition={_.isEmpty(shopBag.data) && shopBag.success}>
            <div className="text-center margin-top-lg">
              <i className="icon-bag icon-6x icon-grey"></i>
              <p className="font-grey">您的购物车空空如也～快去装满它吧</p>
              <p className="font-grey-light margin-bottom-xs">快去挑选几件喜欢的宝贝吧～</p>
              <Link className="button button-stable" to="/">随便逛逛</Link>
            </div>
          </If>
          <If condition={!_.isEmpty(shopBagHistory.data) || shopBagHistory.isLoading}>
            <p className="margin-top-sm margin-left-xs font-xs">可重新购买商品</p>
            <ul className="shop-bag-list top-border">
              {shopBagHistory.isLoading ? <Loader/> : null}
              {_.isEmpty(shopBagHistory.data) ? null : shopBagHistory.data.map((item) => {
                return (
                  <li key={item.id} className="row no-margin bottom-border">
                    <div className="col-xs-4">
                      <img src={item.pic_path + constants.image.square} />
                    </div>
                    <div className="col-xs-8">
                      <p className="no-wrap">{item.title}</p>
                      <p className="font-xs font-grey-light">{item.sku_name}</p>
                      <p>
                        <span className="font-lg font-orange">{'￥' + item.price}</span>
                        <span className="font-grey-light">{'/￥' + item.std_sale_price}</span>
                        <button className="button button-stable button-sm font-xs pull-right" type="button" data-itemid={item.item_id} data-cartid={item.id} data-skuid={item.sku_id} onClick={this.onRebuyClick}>再次购买</button>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </If>
        </div>
        <If condition={!_.isEmpty(shopBag.data) && shopBag.success}>
          <BottomBar size="large">
            <p>
              <span className="font-xs">应付款金额</span>
              <span className="font-lg font-orange">{'￥' + this.totalPrice()}</span>
            </p>
            <button className="button button-energized col-xs-12" type="button" onClick={this.onBuyNowClick}>购买</button>
          </BottomBar>
        </If>
      </div>
    );
  }
}
