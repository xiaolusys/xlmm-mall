import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Header } from 'components/Header';
import { Carousel } from 'components/Carousel';
import { Timer } from 'components/Timer';
import { Image } from 'components/Image';
import { BottomBar } from 'components/BottomBar';
import { Popup } from 'components/Popup';
import { Toast } from 'components/Toast';
import classnames from 'classnames';
import * as detailsAction from 'actions/product/details';
import * as shopBagAction from 'actions/shopBag';
import * as constants from 'constants';
import * as utils from 'utils';
import * as plugins from 'plugins';
import _ from 'underscore';

import './index.scss';

const actionCreators = _.extend(detailsAction, shopBagAction);
const tabs = {
  details: 0,
  faq: 1,
};

@connect(
  state => ({
    details: state.productDetails.data,
    isLoading: state.productDetails.isLoading,
    error: state.productDetails.error,
    success: state.productDetails.success,
    shopBag: state.shopBag,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Detail extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    skuPopupPrefixCls: React.PropTypes.string,
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    details: React.PropTypes.object,
    fetchProductDetails: React.PropTypes.func,
    shopBag: React.PropTypes.object,
    addProductToShopBag: React.PropTypes.func,
    resetProductDetails: React.PropTypes.func,
    resetAddProductToShopBag: React.PropTypes.func,
    fetchShopBagQuantity: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'product-details',
    skuPopupPrefixCls: 'sku-popup',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    trasparentHeader: true,
    stickyTab: false,
    activeTab: 0,
    activeSkuPopup: false,
    windowWidth: utils.dom.windowWidth(),
    carouselHeight: Number((utils.dom.windowHeight() * 0.7).toFixed(0)),
    num: 1,
    productId: 0,
    skuId: 0,
  }

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchProductDetails(params.id);
    this.props.fetchShopBagQuantity();
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.addEventListener();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shopBag.addProduct.success && nextProps.shopBag.addProduct.data.code === 0) {
      Toast.show(nextProps.shopBag.addProduct.data.info);
      this.setState({ activeSkuPopup: false });
    }
    if (nextProps.shopBag.addProduct.success && nextProps.shopBag.addProduct.data.info) {
      Toast.show(nextProps.shopBag.addProduct.data.info);
    }
    if (nextProps.shopBag.addProduct.error) {
      console.log(nextProps.shopBag.addProduct.status);
      switch (nextProps.shopBag.addProduct.status) {
        case 403:
          if (utils.detector.isApp()) {
            plugins.invoke({ method: 'jumpToNativeLogin' });
            console.log('jumpToNativeLogin');
            return;
          }
          this.context.router.push(`/user/login?next=${this.props.location.pathname}`);
          return;
        case 500:
          Toast.show(nextProps.shopBag.addProduct.data.detail);
          break;
        default:
          Toast.show(nextProps.shopBag.addProduct.data.detail);
          break;
      }
    }
  }

  componentWillUnmount() {
    this.removeEventListener();
    this.props.resetAddProductToShopBag();
    this.props.resetProductDetails();
  }

  onWindowResize = (e) => {
    this.setState({ windowWidth: utils.dom.windowWidth() });
  }

  onScroll = (e) => {
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const { carouselHeight } = this.state;
    if (scrollTop >= carouselHeight) {
      this.setState({ trasparentHeader: false });
    } else if (scrollTop < carouselHeight) {
      this.setState({ trasparentHeader: true });
    }
  }

  onShopbagClick = (e) => {
    if (utils.detector.isApp()) {
      plugins.invoke({
        method: 'jumpToNativeLocation',
        data: { target_url: 'com.jimei.xlmm://app/v1/shopping_cart' },
        callback: (resp) => {},
      });
      return false;
    }
    this.context.router.push('/shop/bag');
    e.preventDefault();
  }

  onShareBtnClick = (e) => {

  }

  onPopupOverlayClick = (e) => {
    this.setState({ activeSkuPopup: false });
    e.preventDefault();
  }

  onAddToShopBagClick = (e) => {
    const skus = this.props.details.sku_info;
    let defaultSku = {};
    for (const skuIndex in skus) {
      let sum = 0;
      for (const itemIndex in skus[skuIndex].sku_items) {
        sum += skus[skuIndex].sku_items[itemIndex].free_num;
      }
      if (sum > 0) {
        defaultSku = skus[skuIndex];
        break;
      }
    }
    let skuId = 0;
    for (const index in defaultSku.sku_items) {
      if (defaultSku.sku_items[index].free_num > 0) {
        skuId = defaultSku.sku_items[index].sku_id;
        break;
      }
    }
    this.setState({
      productId: defaultSku.product_id,
      skuId: skuId,
      activeSkuPopup: true,
    });
    e.preventDefault();
  }

  onSkuItemClick = (e) => {
    const dataset = e.currentTarget.dataset;
    if (dataset.disabled === 'true') {
      return false;
    }
    if (dataset.productid) {
      const productId = Number(dataset.productid);
      const product = this.getProduct(productId);
      this.setState({
        productId: productId,
        skuId: product.sku_items[0].sku_id,
      });
    }
    if (dataset.skuid) {
      this.setState({ skuId: Number(dataset.skuid) });
    }
  }

  onUdpateQuantityClick = (e) => {
    const dataset = e.currentTarget.dataset;
    if (this.state.num <= 1 && dataset.action === 'minus') {
      return;
    }
    switch (dataset.action) {
      case 'minus':
        this.setState({ num: this.state.num - 1 });
        break;
      case 'plus':
        this.setState({ num: this.state.num + 1 });
        break;
      default:
        break;
    }
    e.preventDefault();
  }

  onConfirmAddToShopBagClick = (e) => {
    const { productId, skuId, num } = this.state;
    this.props.addProductToShopBag(productId, skuId, num);
  }

  getProduct = (productId) => {
    const skus = this.props.details.sku_info;
    let product = {};
    _.each(skus, (sku) => {
      if (sku.product_id === Number(productId)) {
        product = sku;
      }
    });
    return product;
  }

  addEventListener = () => {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('scroll', this.onScroll);
  }

  removeEventListener = () => {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('scroll', this.onScroll);
  }

  renderCarousel(images) {
    const { windowWidth, carouselHeight } = this.state;
    return (
      <Carousel >
      {images.map((image, index) => {
        return (
          <div key={index}>
            <Image className="head-image" style={{ width: windowWidth, height: carouselHeight }} thumbnail={windowWidth} crop={ windowWidth + 'x' + carouselHeight } src={image} />
          </div>
        );
      })}
      </Carousel>
    );
  }

  renderProductInfo(info) {
    return (
      <div>
        <div className="product-info bottom-border bg-white">
          <div className="row no-margin">
            <p className="font-md">{info.name}</p>
          </div>
          <div className="row no-margin">
            <p className="col-xs-6 no-padding">
              <span className="font-32">{'￥' + info.lowest_agent_price}</span>
              <span className="font-xs font-grey-light">{'/￥' + info.lowest_std_sale_price}</span>
            </p>
            <p className="col-xs-6 no-padding margin-top-xs text-right">
              {info.item_marks.map((tag, index) => { return (<span key={index} className="tag">{tag}</span>); })}
            </p>
          </div>
        </div>
        <p className="on-shelf-countdown bottom-border bg-white margin-bottom-xxs">
          <span>剩余时间</span>
          <Timer className="pull-right" endDateString={info.offshelf_time} format="dd天:hh时:mm分:ss秒" />
        </p>
      </div>
    );
  }

  renderPromotion() {
    return (
      <div className="row no-margin text-center bg-white">
        <div className="col-xs-3 no-padding">
          <i className="icon-new icon-3x icon-red"></i>
          <p>天天上新</p>
        </div>
        <div className="col-xs-3 no-padding">
          <i className="icon-shield icon-3x icon-red"></i>
          <p>100%正品</p>
        </div>
        <div className="col-xs-3 no-padding">
          <i className="icon-truck-o icon-3x icon-red"></i>
          <p>全国包邮</p>
        </div>
        <div className="col-xs-3 no-padding">
          <i className="icon-seven-o icon-3x icon-red"></i>
          <p>七天退货</p>
        </div>
      </div>
    );
  }

  renderProductProps(info) {
    return (
      <div className="product-spec bg-white margin-top-xxs">
        <p className="font-md font-weight-700">商品参数</p>
        <p><span>商品编号</span><span className="margin-left-xxs font-grey-light">{info.model_code}</span></p>
        <p><span>商品材质</span><span className="margin-left-xxs font-grey-light">{info.properties.material}</span></p>
        <p><span>可选颜色</span><span className="margin-left-xxs font-grey-light">{info.properties.color}</span></p>
        <p><span>洗涤说明</span><span className="margin-left-xxs font-grey-light">{info.properties.wash_instructions}</span></p>
      </div>
    );
  }

  renderRow(cells) {
    return (
      <tr>
        {cells.map((cell, cellIndx) => {
          return (<th key={cellIndx} className="text-center font-weight-200">{cell}</th>);
        })}
      </tr>
    );
  }

  renderProductSpec(rows) {
    const self = this;
    return (
      <table className="table">
        <thead>{self.renderRow(rows[0])}</thead>
        <tbody>
        {rows.map((cells, rowIndex) => {
          if (rowIndex > 0) {
            return self.renderRow(cells);
          }
        })}
        </tbody>
      </table>
    );
  }

  renderDetails(images) {
    const { stickyTab, activeTab } = this.state;
    return (
      <div className="bg-white">
        <div className="font-md font-weight-700 bottom-border padding-bottom-xxs padding-top-xxs padding-left-xxs">商品展示</div>
        <div className="details">
          {images.map((image, index) => {
            return (<Image key={index} className="col-xs-12 no-padding" thumbnail={640} src={image} />);
          })}
        </div>
      </div>
    );
  }

  renderSkuHeader() {
    const { skuPopupPrefixCls, details } = this.props;
    const { productId, skuId } = this.state;
    const product = this.getProduct(productId);
    return (
      <div className={`row bottom-border ${skuPopupPrefixCls}-header`}>
        <Image className="col-xs-3 no-padding" thumbnail={200} crop="200x200" src={product.product_img} />
        <div className="col-xs-7 no-padding">
          <p className="product-name">{details.detail_content.name}</p>
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

  renderSkuColor() {
    const { productId, skuId } = this.state;
    const skus = this.props.details.sku_info;
    const product = this.getProduct(productId);
    return (
      <div className="row no-margin sku-list">
        <div className="col-xs-2 no-padding">颜色</div>
        <ul className="col-xs-10 no-padding">
        {skus.map((sku) => {
          let sum = 0;
          _.each(sku.sku_items, (skuItem) => {
            sum += skuItem.free_num;
          });
          const skuItemCls = classnames({
            ['sku-item no-wrap']: true,
            ['active']: product.product_id === sku.product_id,
            ['disabled']: sum <= 0,
          });
          return (
            <li onClick={this.onSkuItemClick} key={sku.product_id} data-productid={sku.product_id} data-disabled={sum <= 0}>
              <lable className={skuItemCls}>{sku.name}</lable>
            </li>
          );
        })}
        </ul>
      </div>
    );
  }

  renderSkuSize() {
    const { productId, skuId } = this.state;
    const product = this.getProduct(productId);
    return (
      <div className="row no-margin sku-list">
        <div className="col-xs-2 no-padding">尺寸</div>
        <ul className="col-xs-10 no-padding">
        {product.sku_items.map((item) => {
          const skuItemCls = classnames({
            ['sku-item no-wrap']: true,
            ['active']: item.sku_id === skuId,
            ['disabled']: item.free_num <= 0,
          });
          return (
            <li onClick={this.onSkuItemClick} key={item.sku_id} data-skuid={item.sku_id} data-disabled={item.free_num <= 0}>
              <lable className={skuItemCls}>{item.name}</lable>
            </li>
          );
        })}
        </ul>
      </div>
    );
  }


  render() {
    const self = this;
    const { prefixCls, skuPopupPrefixCls, details, shopBag } = this.props;
    const { trasparentHeader, activeSkuPopup, num, productId, skuId } = this.state;
    let badge = 0;
    if (shopBag.shopBagQuantity.data) {
      badge = shopBag.shopBagQuantity.data.result;
    }
    return (
      <div className={`${prefixCls}`}>
        <Header trasparent={trasparentHeader} title="商品详情" leftIcon="icon-angle-left" rightIcon={utils.detector.isApp() ? 'icon-share' : ''} onLeftBtnClick={this.context.router.goBack} onRightBrnClick={this.onShareBtnClick} />
        <If condition={!_.isEmpty(details.detail_content)}>
          <div className="content">
            {this.renderCarousel(details.detail_content.head_imgs)}
            {this.renderProductInfo(details.detail_content)}
            {this.renderPromotion()}
            {this.renderProductProps(details.detail_content)}
            <If condition={!_.isEmpty(details.comparison)}>
              {details.comparison.tables.map((spec, tableIndex) => {
                return self.renderProductSpec(spec.table);
              })}
            </If>
            {this.renderDetails(details.detail_content.content_imgs)}
          </div>
          <BottomBar className="clearfix" size="medium">
            <div className="col-xs-2 no-padding shop-cart">
              <div onClick={this.onShopbagClick}>
                <i className="icon-cart icon-yellow"></i>
                <If condition={badge > 0}>
                  <span className="shop-cart-badge no-wrap">{badge}</span>
                </If>
              </div>
            </div>
            <button className="button button-energized col-xs-10 no-padding" type="button" onClick={this.onAddToShopBagClick}>加入购物车</button>
          </BottomBar>
          <If condition={activeSkuPopup}>
            <Popup className={`${skuPopupPrefixCls}`} active={activeSkuPopup} onPopupOverlayClick={this.onPopupOverlayClick}>
              {this.renderSkuHeader()}
              {this.renderSkuColor()}
              {this.renderSkuSize()}
              <div className="row no-margin quantity">
                <div className="col-xs-2 no-padding">个数</div>
                <p className="col-xs-10 no-padding">
                  <span className="minus" data-action="minus" onClick={this.onUdpateQuantityClick}>-</span>
                  <span>{num}</span>
                  <span className="plus" data-action="plus" onClick={this.onUdpateQuantityClick}>+</span>
                </p>
              </div>
              <BottomBar size="medium">
                <button className="button button-energized col-xs-10 col-xs-offset-1 no-padding" type="button" onClick={this.onConfirmAddToShopBagClick}>确定</button>
              </BottomBar>
            </Popup>
          </If>
        </If>
      </div>
    );
  }
}
