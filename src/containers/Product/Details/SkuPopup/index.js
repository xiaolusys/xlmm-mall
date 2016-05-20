import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Popup } from 'components/Popup';
import { Image } from 'components/Image';
import { BottomBar } from 'components/BottomBar';
import classnames from 'classnames';
import _ from 'underscore';

import './index.scss';

export class SkuPopup extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    active: React.PropTypes.bool,
    onPopupOverlayClick: React.PropTypes.func,
    onUdpateQuantityClick: React.PropTypes.func,
    onConfirmAddToShopBagClick: React.PropTypes.func,
    onSkuItemClick: React.PropTypes.func,
    skus: React.PropTypes.array,
    productName: React.PropTypes.string,
    num: React.PropTypes.number,
    productId: React.PropTypes.number,
    skuId: React.PropTypes.number,
  };

  static defaultProps = {
    prefixCls: 'sku-popup',
    num: 1,
    productId: 0,
    skuId: 0,
  }

  constructor(props) {
    super(props);
  }

  state = {

  }

  getProduct = (productId) => {
    const { skus } = this.props;
    let product = {};
    _.each(skus, (sku) => {
      if (sku.product_id === Number(productId)) {
        product = sku;
      }
    });
    return product;
  }

  renderHeader() {
    const { prefixCls, productName, productId, skuId } = this.props;
    const product = this.getProduct(productId);
    console.log(product);
    return (
      <div className={`row bottom-border ${prefixCls}-header`}>
        <Image className="col-xs-3 no-padding" thumbnail={200} crop="200x200" src={product.product_img} />
        <div className="col-xs-7 no-padding">
          <p className="product-name">{productName}</p>
          {product.sku_items.map((item) => {
            if (item.sku_id === skuId) {
              return (
                <p>
                  <span className="font-26">{'￥' + item.agent_price.toFixed(2)}</span>
                  <span className="font-grey-light">{'/￥' + item.std_sale_price.toFixed(2)}</span>
                </p>
              );
            }
          })}
        </div>
      </div>
    );
  }

  renderColor() {
    const { skus, productId, skuId, onSkuItemClick } = this.props;
    const product = this.getProduct(productId);
    return (
      <div className="row no-margin sku-list">
        <div className="col-xs-2 no-padding">颜色</div>
        <ul className="col-xs-10 no-padding">
        {skus.map((sku) => {
          return (
            <li onClick={onSkuItemClick} key={sku.product_id} data-productid={sku.product_id}>
              <lable className={'sku-item no-wrap ' + (product.product_id === sku.product_id ? 'active' : '')}>{sku.name}</lable>
            </li>
          );
        })}
        </ul>
      </div>
    );
  }

  renderSize() {
    const { productId, skuId, onSkuItemClick } = this.props;
    const product = this.getProduct(productId);
    return (
      <div className="row no-margin sku-list">
        <div className="col-xs-2 no-padding">尺寸</div>
        <ul className="col-xs-10 no-padding">
        {product.sku_items.map((item) => {
          return (
            <li onClick={onSkuItemClick} key={item.sku_id} data-skuid={item.sku_id}>
              <lable className={'sku-item no-wrap ' + (item.sku_id === skuId ? 'active' : '')}>{item.name}</lable>
            </li>
          );
        })}
        </ul>
      </div>
    );
  }

  render() {
    const { prefixCls, active, onPopupOverlayClick, onUdpateQuantityClick, onConfirmAddToShopBagClick, productName, num, skus, productId } = this.props;
    if (!productId) {
      return null;
    }
    return (
      <Popup className={`${prefixCls}`} active={active} onPopupOverlayClick={onPopupOverlayClick}>
        {this.renderHeader()}
        {this.renderColor()}
        {this.renderSize()}
        <div className="row no-margin quantity">
          <div className="col-xs-2 no-padding">个数</div>
          <p className="col-xs-10 no-padding">
            <span className="minus" data-action="minus" onClick={onUdpateQuantityClick}>-</span>
            <span>{num}</span>
            <span className="plus" data-action="plus" onClick={onUdpateQuantityClick}>+</span>
          </p>
        </div>
        <BottomBar size="medium">
          <button className="button button-energized col-xs-10 col-xs-offset-1 no-padding" type="button" onClick={onConfirmAddToShopBagClick}>确定</button>
        </BottomBar>
      </Popup>
    );
  }
}
