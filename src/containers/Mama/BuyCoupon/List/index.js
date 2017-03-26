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
import { InputHeader } from 'components/InputHeader';
import { Timer } from 'components/Timer';
import { CouponProduct } from 'components/CouponProduct';
import { Image } from 'components/Image';
import { ShopBag } from 'components/ShopBag';
import { Favorite } from 'components/Favorite';
import { BackTop } from 'components/BackTop';

import * as mamaInfoAction from 'actions/mama/mamaInfo';
import * as detailsAction from 'actions/home/product';
import * as searchAction from 'actions/product/search';

const actionCreators = _.extend(mamaInfoAction, detailsAction, searchAction);

import './index.scss';

@connect(
  state => ({
    product: {
      data: state.products.data,
      isLoading: state.products.isLoading,
      error: state.products.error,
      success: state.products.success,
    },
    mamaInfo: state.mamaInfo,
    search: state.searchProduct,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class TranCouponList extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    fetchVirtualProductDetails: React.PropTypes.func,
    resetProducts: React.PropTypes.func,
    product: React.PropTypes.any,
    mamaInfo: React.PropTypes.any,
    fetchMamaInfo: React.PropTypes.func,
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
    pageSize: 20,
    activeTab: 'default',
    sticky: false,
    virtualProducts: [],
    searchFlag: false,
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    const { cid } = this.props.location.query;
    this.props.resetProducts();
    this.props.fetchVirtualProductDetails(pageIndex + 1, pageSize);
    this.props.fetchMamaInfo();
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const mamaInfo = nextProps.mamaInfo.mamaInfo;
    let count = 0;
    let size = 0;
    if (nextProps.product.success) {
      count = nextProps.product.data.count;
      size = nextProps.product.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });

      const virtualProducts = [];
      if (!this.state.searchFlag && mamaInfo.data && mamaInfo.data.length > 0
          && nextProps.product.data.results && nextProps.product.data.results.length > 0) {
        let sku = null;
        for (let i = 0; i <= nextProps.product.data.results.length - 1; i++) {
          const productDetails = nextProps.product.data.results[i];
          for (let j = 0; j < productDetails.sku_info.length; j++) {
            if (productDetails.sku_info[j].name.indexOf(mamaInfo.data[0].elite_level) >= 0) {
              sku = productDetails.sku_info[j];
              break;
            }
          }
          const item = {
            id: productDetails.id,
            name: (productDetails.detail_content && sku) ? productDetails.detail_content.name + '/' + sku.name : '',
            head_img: (productDetails && productDetails.detail_content) ? productDetails.detail_content.head_img : '',
            agent_price: sku.agent_price,
            lowest_std_sale_price: sku.std_sale_price,
            elite_score: sku.elite_score,
          };
          virtualProducts.push(item);
        }
        this.setState({ virtualProducts: virtualProducts });
      }
      if (this.state.searchFlag && mamaInfo.data && mamaInfo.data.length > 0
          && nextProps.search.searchProduct.data.results) {
        if (nextProps.search.searchProduct.data.results.length > 0) {
          for (let i = 0; i <= nextProps.search.searchProduct.data.results.length - 1; i++) {
            const productDetails = nextProps.search.searchProduct.data.results[i];
            const item = {
              id: productDetails.id,
              name: (productDetails.name) ? productDetails.name : '',
              head_img: (productDetails) ? productDetails.head_img : '',
              agent_price: '-',
              lowest_std_sale_price: productDetails.lowest_std_sale_price,
              elite_score: productDetails.elite_score,
            };
            virtualProducts.push(item);
          }
        }
        this.setState({ virtualProducts: virtualProducts });
      }
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
    this.setState({ pageIndex: 0 });
  }

  onItemClick = (e) => {
    const { modelid } = e.currentTarget.dataset;
    window.location.href = '/mall/buycoupon?modelid=' + modelid;
  }

  onLeftBtnClick = (e) => {
    if (this.state.searchFlag) {
      this.setState({ searchFlag: false, searchName: '', pageIndex: 0 });
      // this.context.router.replace('/trancoupon/list');
      this.props.resetProducts();
      this.props.fetchVirtualProductDetails(1, this.state.pageSize);
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
      this.setState({ searchFlag: true, pageIndex: 0 });
    }
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const { fetchVirtualProductDetails, product } = this.props;
    const { cid } = this.props.location.query;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();

    if (scrollTop === documentHeight - windowHeight && this.state.hasMore) {
      if (this.state.searchFlag && !this.props.search.searchProduct.isLoading) {
        this.props.searchProduct(this.state.searchName, 1, pageIndex + 1, pageSize);
      }
      if (!this.state.searchFlag && !this.props.product.isLoading) {
        this.props.fetchVirtualProductDetails(pageIndex + 1, pageSize);
      }
    }

  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { product, search } = this.props;
    const { title } = this.props.location.query;
    const products = this.state.virtualProducts || [];
    const hasHeader = !utils.detector.isApp();
    const { activeTab, sticky } = this.state;

    return (
      <div className="buycoupon-list">
        <InputHeader placeholder=" 输入查询的商品" onInputChange={this.onInputChange} leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick} rightText="搜索" onRightBtnClick={this.onSearchClick} />
        <div className="content content-white-bg">
          <div className="product-list-p" >
          <div className="margin-top-xxs" ></div>
            {products.map((item) => {
              return <CouponProduct key={item.id} product={item} onItemClick = {this.onItemClick} />;
            })}
          </div>
          <If condition={search.searchProduct.success && search.searchProduct.data && (search.searchProduct.data.count === 0) && this.state.searchFlag}>
            <div className="empty-search">
              <p style={{ paddingTop: '8px', paddingDown: '8px', textAlign: 'center' }}>抱歉，商城没有您要查询的商品！</p>
            </div>
          </If>
          {product.isLoading ? <Loader/> : null}
          <BackTop />
        </div>
      </div>
    );
  }
}
