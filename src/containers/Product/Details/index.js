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
import { DownloadAppBanner } from 'components/DownloadAppBanner';
import classnames from 'classnames';
import * as detailsAction from 'actions/product/details';
import * as shopBagAction from 'actions/shopBag';
import * as shareAction from 'actions/share';
import * as wechatSignAction from 'actions/wechat/sign';
import * as favoriteAction from 'actions/favorite/index';
import * as constants from 'constants';
import * as utils from 'utils';
import * as plugins from 'plugins';
import _ from 'underscore';

import './index.scss';

const actionCreators = _.extend(detailsAction, shopBagAction, shareAction, wechatSignAction, favoriteAction);
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
    share: state.share,
    wechatSign: state.wechatSign,
    favorite: state.favorite,
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
    isLoading: React.PropTypes.bool,
    fetchProductDetails: React.PropTypes.func,
    shopBag: React.PropTypes.object,
    share: React.PropTypes.object,
    fetchWechatSign: React.PropTypes.func,
    wechatSign: React.PropTypes.object,
    addProductToShopBag: React.PropTypes.func,
    resetProductDetails: React.PropTypes.func,
    resetAddProductToShopBag: React.PropTypes.func,
    fetchShopBagQuantity: React.PropTypes.func,
    fetchShareInfo: React.PropTypes.func,
    addFavorite: React.PropTypes.func,
    unFavorite: React.PropTypes.func,
    resetAddFavorite: React.PropTypes.func,
    resetUnFavorite: React.PropTypes.func,
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
    num: 1,
    productId: 0,
    skuId: 0,
    favoriteStatus: false,
  }

  componentWillMount() {
    const { params } = this.props;
    const productId = params.id.match(/(\d+)/)[0];
    this.props.fetchProductDetails(productId);
    this.props.fetchShopBagQuantity();
    this.props.fetchShareInfo(constants.shareType.product, productId);
    if (utils.detector.isWechat()) {
      this.props.fetchWechatSign();
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.addEventListener();
  }

  componentWillReceiveProps(nextProps) {
    const { addFavorite, unFavorite } = nextProps.favorite;
    utils.wechat.config(nextProps.wechatSign);
    utils.wechat.configShareContent(nextProps.share);
    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else if (!nextProps.isLoading) {
      utils.ui.loadingSpinner.hide();
    }
    if (nextProps.shopBag.addProduct.success && nextProps.shopBag.addProduct.data.code === 0) {
      Toast.show(nextProps.shopBag.addProduct.data.info);
      this.setState({ activeSkuPopup: false });
    }
    if (nextProps.shopBag.addProduct.success && nextProps.shopBag.addProduct.data.info) {
      Toast.show(nextProps.shopBag.addProduct.data.info);
    }
    if (nextProps.shopBag.addProduct.error) {
      switch (nextProps.shopBag.addProduct.status) {
        case 403:
          if (utils.detector.isApp()) {
            plugins.invoke({ method: 'jumpToNativeLogin' });
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
    if (addFavorite.error) {
      switch (addFavorite.status) {
        case 403:
          if (utils.detector.isApp()) {
            plugins.invoke({ method: 'jumpToNativeLogin' });
            return;
          }
          this.context.router.push(`/user/login?next=${this.props.location.pathname}`);
          return;
        case 500:
          Toast.show(addFavorite.data.detail);
          break;
        default:
          Toast.show(addFavorite.data.detail);
          break;
      }
    }
    if (unFavorite.error) {
      switch (addFavorite.status) {
        case 403:
          if (utils.detector.isApp()) {
            plugins.invoke({ method: 'jumpToNativeLogin' });
            return;
          }
          this.context.router.push(`/user/login?next=${this.props.location.pathname}`);
          return;
        case 500:
          Toast.show(unFavorite.data.detail);
          break;
        default:
          Toast.show(unFavorite.data.detail);
          break;
      }
    }
    if (addFavorite.success && addFavorite.data.code >= 0) {
      Toast.show(addFavorite.data.info);
      if (addFavorite.data.code === 0) {
        this.setState({ favoriteStatus: true });
      }
      return;
    }
    if (unFavorite.success && unFavorite.data.code >= 0) {
      Toast.show(unFavorite.data.info);
      if (unFavorite.data.code === 0) {
        this.setState({ favoriteStatus: false });
      }
      return;
    }
    if (!_.isEmpty(nextProps.details)) {
      this.setState({ favoriteStatus: nextProps.details.custom_info.is_favorite });
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
    const carouselHeight = Number((utils.dom.windowHeight() * 0.7).toFixed(0));
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
    } else {
      this.context.router.push('/shop/bag');
    }
    e.preventDefault();
  }

  onShareBtnClick = (e) => {
    const shareInfo = this.props.share.data;
    plugins.invoke({
      method: 'callNativeUniShareFunc',
      data: {
        share_title: shareInfo.title,
        share_to: '',
        share_desc: shareInfo.desc,
        share_icon: shareInfo.share_img,
        share_type: 'link',
        link: shareInfo.share_link,
      },
    });
  }

  onBackBtnClick = (e) => {
    if (utils.detector.isApp()) {
      plugins.invoke({ method: 'callNativeBack' });
    } else {
      this.context.router.goSmartBack();
    }
    e.preventDefault();
  }

  onPopupOverlayClick = (e) => {
    this.setState({ activeSkuPopup: false });
    e.preventDefault();
  }

  onAddToShopBagClick = (e) => {
    const { details } = this.props;
    const skus = details.sku_info;
    if (details.detail_content.is_flatten) {
      this.props.addProductToShopBag(skus[0].product_id, skus[0].sku_items[0].sku_id, 1);
      return;
    }
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
    e.preventDefault();
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
    e.preventDefault();
  }
  onFavoriteBtnClick = (e) => {
    const { favoriteStatus } = this.state;
    const { id } = this.props.params;
    if (favoriteStatus) {
      this.props.resetAddFavorite();
      this.props.unFavorite(id);
    } else {
      this.props.resetUnFavorite();
      this.props.addFavorite(id);
    }
    this.setState({ favoriteStatus: !favoriteStatus });
    e.preventDefault();
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

  getAddToShopBagBtnText = (detail) => {
    if (detail.is_sale_out) {
      return '已抢光';
    } else if (!detail.is_saleopen) {
      return '即将开售';
    }
    return '加入购物车';
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
    const windowWidth = utils.dom.windowWidth();
    const carouselHeight = Number((utils.dom.windowHeight() * 0.7).toFixed(0));
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
    const { favoriteStatus } = this.state;
    return (
      <div>
        <div className="product-info bottom-border bg-white">
          <div className="row no-margin">
            <p className="col-xs-8 no-padding no-wrap font-md">{info.name}</p>
            <div className="col-xs-4 no-padding icon-favorite" onClick={this.onFavoriteBtnClick}>
              <If condition={favoriteStatus}>
                <i className="col-xs-3 icon-favorite-yes font-lg text-left"></i>
              </If>
              <If condition={!favoriteStatus}>
                <i className="col-xs-3 icon-favorite-no font-lg text-left"></i>
              </If>
              <p className="no-margin margin-left-xxs text-center">{favoriteStatus ? '取消收藏' : '收藏'}</p>
            </div>
          </div>
          <div className="row no-margin">
            <p className="col-xs-6 no-padding">
              <span className="font-32">{'￥' + info.lowest_agent_price}</span>
              <span className="font-grey">/</span>
              <span className="font-xs font-grey-light text-line-through">{'￥' + info.lowest_std_sale_price}</span>
            </p>
            <p className="col-xs-6 no-padding margin-top-xs text-right">
              {info.item_marks.map((tag, index) => { return (<span key={index} className="tag">{tag}</span>); })}
            </p>
          </div>
        </div>
        <p className="on-shelf-countdown bottom-border bg-white margin-bottom-xxs">
          <span>剩余时间</span>
          <Timer className="pull-right" endDateString={info.offshelf_time} />
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

  renderProductProps(attributes = []) {
    return (
      <div className="product-spec bg-white margin-top-xxs">
        <p className="font-md font-weight-700">商品参数</p>
        {attributes.map((attribute) => (
          <p><span>{attribute.name}</span><span className="margin-left-xxs font-grey-light">{attribute.value}</span></p>
        ))}
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
      <div className="table-container">
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
      </div>
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
        {product.sku_items.map((item) => {
          if (item.sku_id === skuId) {
            return (
              <div className="col-xs-7 no-padding">
                <p className="product-name">{details.detail_content.name + '/' + product.name}</p>
                <p>
                  <span className="font-26">{'￥' + item.agent_price.toFixed(2)}</span>
                  <span className="font-grey-light">{'/￥' + item.std_sale_price.toFixed(2)}</span>
                </p>
              </div>
            );
          }
        })}
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
    const { preview } = this.props.location.query;
    return (
      <div className={`${prefixCls}`}>
        <Header trasparent={trasparentHeader} title="商品详情" leftIcon="icon-angle-left" rightIcon={utils.detector.isApp() ? 'icon-share' : ''} onLeftBtnClick={this.onBackBtnClick} onRightBtnClick={this.onShareBtnClick} />
        <If condition={!_.isEmpty(details.detail_content)}>
          <div className="content">
            {this.renderCarousel(details.detail_content.head_imgs)}
            <DownloadAppBanner />
            {this.renderProductInfo(details.detail_content)}
            {this.renderPromotion()}
            {this.renderProductProps(details.comparison.attributes)}
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
            <button className="button button-energized col-xs-10 no-padding" type="button" onClick={this.onAddToShopBagClick} disabled={(details.detail_content.is_sale_out || !details.detail_content.is_saleopen) && preview !== 'true'}>
              {this.getAddToShopBagBtnText(details.detail_content)}
            </button>
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
