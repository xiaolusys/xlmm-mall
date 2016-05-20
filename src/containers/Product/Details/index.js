import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Header } from 'components/Header';
import { Carousel } from 'components/Carousel';
import { Timer } from 'components/Timer';
import { Image } from 'components/Image';
import { BottomBar } from 'components/BottomBar';
import { SkuPopup } from './SkuPopup';
import { Toast } from 'components/Toast';
import classnames from 'classnames';
import * as detailsAction from 'actions/product/details';
import * as shopBagAction from 'actions/shopBag';
import * as constants from 'constants';
import * as utils from 'utils';
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
    params: React.PropTypes.object,
    location: React.PropTypes.object,
    details: React.PropTypes.object,
    fetchProductDetails: React.PropTypes.func,
    shopBag: React.PropTypes.object,
    addProductToShopBag: React.PropTypes.func,
    resetProductDetails: React.PropTypes.func,
    resetAddProductToShopBag: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'product-details',
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
    carouselHeight: (utils.dom.windowHeight() * 0.7).toFixed(0),
    num: 1,
    productId: 0,
    skuId: 0,
  }

  componentWillMount() {
    const { params } = this.props;
    this.props.fetchProductDetails(params.id);
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
      if (nextProps.shopBag.addProduct.data.detail) {
        this.context.router.push(`/user/login?next=${this.props.location.pathname}`);
      } else {
        Toast.show('加入购物车失败');
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

  onPopupOverlayClick = (e) => {
    this.setState({ activeSkuPopup: false });
    e.preventDefault();
  }

  onAddToShopBagClick = (e) => {
    const skus = this.props.details.sku_info;
    this.setState({
      productId: skus[0].product_id,
      skuId: skus[0].sku_items[0].sku_id,
      activeSkuPopup: true,
    });
    e.preventDefault();
  }

  onSkuItemClick = (e) => {
    const dataset = e.currentTarget.dataset;
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
              {info.item_marks.map((tag, index) => { return (<span className="tag" key={index}>{tag}</span>); })}
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
          return (<th className="text-center font-weight-200">{cell}</th>);
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

  render() {
    const self = this;
    const { prefixCls, details } = this.props;
    const { trasparentHeader, activeSkuPopup, num, productId, skuId } = this.state;

    return (
      <div className={`${prefixCls}`}>
        <Header trasparent={trasparentHeader} title="商品详情" leftIcon="icon-angle-left" rightIcon={utils.detector.isApp() ? 'icon-share' : ''} onLeftBtnClick={this.context.router.goBack} />
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
            <Link className="col-xs-2 no-padding shop-cart" to="/shop/bag">
              <div><i className="icon-cart icon-yellow"></i></div>
            </Link>
            <button className="button button-energized col-xs-10 no-padding" type="button" onClick={this.onAddToShopBagClick}>加入购物车</button>
          </BottomBar>
          <SkuPopup active={activeSkuPopup} skus={details.sku_info} productName={details.detail_content.name} num={num} productId={productId} skuId={skuId} onPopupOverlayClick={this.onPopupOverlayClick} onSkuItemClick={this.onSkuItemClick} onUdpateQuantityClick={this.onUdpateQuantityClick} onConfirmAddToShopBagClick={this.onConfirmAddToShopBagClick} />
        </If>
      </div>
    );
  }
}
