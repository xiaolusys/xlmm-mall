import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { InputHeader } from 'components/InputHeader';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';
import { Popup } from 'components/Popup';
import { If } from 'jsx-control-statements';
import * as utils from 'utils';
import * as mamaInfoAction from 'actions/mama/mamaInfo';
import * as detailsAction from 'actions/home/product';
import * as searchAction from 'actions/product/search';
import * as plugins from 'plugins';

import './index.scss';

const actionCreators = _.extend(mamaInfoAction, detailsAction, searchAction);

@connect(
  state => ({
    mamaInfo: state.mamaInfo,
    productDetails: state.products,
    search: state.searchProduct,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class TranCouponList extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    fetchVirtualProductDetails: React.PropTypes.func,
    fetchMamaInfo: React.PropTypes.func,
    mamaInfo: React.PropTypes.any,
    productDetails: React.PropTypes.object,
    search: React.PropTypes.object,
    searchProduct: React.PropTypes.func,
    resetSearchProduct: React.PropTypes.func,
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
    sticky: false,
    searchFlag: false,
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    this.props.fetchVirtualProductDetails(pageIndex + 1, pageSize);
    this.props.fetchMamaInfo();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaInfo, productDetails, search } = nextProps;

    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else if (!nextProps.isLoading) {
      utils.ui.loadingSpinner.hide();
    }

    let count = 0;
    let size = 0;
    let data = null;
    if (this.state.searchFlag) {
      if (search.searchProduct.success) {
        data = search.searchProduct.data;
      }
    } else {
      if (productDetails.success) {
        data = productDetails.data;
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
    this.setState({ pageIndex: 0 });
  }

  onProductClick = (e) => {
    const { index, modelid } = e.currentTarget.dataset;
    // this.context.router.push('/product/details/' + modelid);
    window.location.href = '/mall/buycoupon?index=' + index + '&modelid=' + modelid;
  }

  onCategoryClick = (e) => {
    let { cid } = this.props.location.query;
    if (!cid) {
      cid = 0;
    }
    window.location.href = '/mall/product/categories' + (cid ? `?cid=${cid}` : '') + '&title=分类' + '&product_type=coupon';
  }

  onLeftBtnClick = (e) => {
    if (this.state.searchFlag) {
      this.setState({ searchFlag: false, searchName: '' });
      this.context.router.replace('/trancoupon/list');
    } else {
      this.context.router.goBack();
    }
  }

  onInputChange = (e) => {
    const value = e.target.value;
    this.setState({ searchName: value });
  }

  onSearchClick = (e) => {
    if (this.state.searchName && this.state.searchName.length > 0) {
      this.props.resetSearchProduct();
      this.props.searchProduct(this.state.searchName, 1, 1, this.state.pageSize);
      this.setState({ searchFlag: true });
    }
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, searchFlag } = this.state;
    const { fetchVirtualProductDetails, searchProduct } = this.props;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.buycoupon-container');

    if (scrollTop === documentHeight - windowHeight && this.state.hasMore) {
      if (this.state.searchFlag && !this.props.search.searchProduct.isLoading) {
        this.props.searchProduct(this.state.searchName, 1, pageIndex + 1, pageSize);
      }
      if (!this.state.searchFlag && !this.props.productDetails.isLoading) {
        this.props.fetchVirtualProductDetails(pageIndex + 1, pageSize);
      }
    }

    // if (scrollTop > tabsOffsetTop) {
    //   this.setState({ sticky: true });
    // } else {
    //   this.setState({ sticky: false });
    // }
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  renderProduct = (product, index) => {
    const mamaInfo = this.props.mamaInfo.mamaInfo;
    const productDetails = product;
    const imgSrc = (productDetails && productDetails.detail_content) ? productDetails.detail_content.head_img : '';
    let sku = null;

    if (this.state.searchFlag) {
      return (
      <li key={index} className="col-xs-6 product-item bottom-border" data-index={index} data-modelid={product.id} onClick={this.onProductClick}>
        <Image className="coupon-img" src={product.head_img} quality={70} />
        <div className="product-info bg-white">
          <div className="row no-margin">
            <p className="no-padding no-wrap font-xs">{product.name }</p>
          </div>
          <div className="row no-margin">
            <p className="no-wrap">
              <span className="font-xs">{'￥'}</span>
              <span className="font-grey">/</span>
              <span className="font-xs font-grey-light text-line-through">{'￥' + (product.lowest_std_sale_price)}</span>
              <span className="font-grey font-xs" style={{ paddingLeft: '8px' }}>{(product.elite_score) ? '积分' + product.elite_score : ''}</span>
            </p>
          </div>
        </div>
      </li>
    );
    }

    for (let i = 0; i < productDetails.sku_info.length; i++) {
      if (productDetails.sku_info[i].name.indexOf(mamaInfo.data[0].elite_level) >= 0) {
        sku = productDetails.sku_info[i];
        break;
      }
    }

    return (
      <li key={index} className="col-xs-6 product-item bottom-border" data-index={index} data-modelid={product.id} onClick={this.onProductClick}>
        <Image className="coupon-img" src={imgSrc} quality={70} />
        <div className="product-info bg-white">
          <div className="row no-margin">
            <p className="no-padding no-wrap font-xs">{(productDetails.detail_content && sku) ? productDetails.detail_content.name + '/' + sku.name : '' }</p>
          </div>
          <div className="row no-margin">
            <p className="no-wrap">
              <span className="font-xs">{'￥' + (sku ? sku.agent_price : '')}</span>
              <span className="font-grey">/</span>
              <span className="font-xs font-grey-light text-line-through">{'￥' + (sku ? sku.std_sale_price : '')}</span>
              <span className="font-grey font-xs" style={{ paddingLeft: '8px' }}>{(sku) ? '积分' + sku.elite_score : ''}</span>
            </p>
          </div>
        </div>
      </li>
    );
  }

  render() {
    const { productDetails, search } = this.props;
    const mamaInfo = this.props.mamaInfo.mamaInfo;
    const trasparentHeader = false;
    const { sticky } = this.state;

    return (
      <div className=" content-white-bg buycouponlist">
        <InputHeader placeholder=" 输入查询的商品" onInputChange={this.onInputChange} leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick} rightText="搜索" onRightBtnClick={this.onSearchClick} />
        <div className="content no-padding">
          <div className={'buycoupon-container ' + (sticky ? 'sticky ' : '') }>
          </div>
          <div className="return-list-p no-padding" >
            <If condition={productDetails.success && productDetails.data && mamaInfo.success && mamaInfo.data && !this.state.searchFlag}>
              <ul className="no-padding">
              {productDetails.data.results.map((item, index) => this.renderProduct(item, index))
              }
              </ul>
            </If>
            <If condition={search.searchProduct.success && search.searchProduct.data && (search.searchProduct.data.count > 0) && mamaInfo.success && mamaInfo.data && this.state.searchFlag}>
              <ul className="no-padding">
              {search.searchProduct.data.results.map((item, index) => this.renderProduct(item, index))
              }
              </ul>
            </If>
          </div>
          <If condition={search.searchProduct.success && search.searchProduct.data && (search.searchProduct.data.count === 0) && this.state.searchFlag}>
              <div className="empty-search">
                <p>抱歉，商城没有您要查询的商品！</p>
              </div>
            </If>
        </div>
      </div>
    );
  }
}
