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
import { Product } from 'components/Product';
import { Image } from 'components/Image';
import { ShopBag } from 'components/ShopBag';
import { Favorite } from 'components/Favorite';
import { BackTop } from 'components/BackTop';
import * as actionCreators from 'actions/home/product';

import './index.scss';

@connect(
  state => ({
    product: {
      data: state.products.data,
      isLoading: state.products.isLoading,
      error: state.products.error,
      success: state.products.success,
    },
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class List extends Component {
  static propTypes = {
    location: React.PropTypes.object,
    fetchProduct: React.PropTypes.func,
    resetProducts: React.PropTypes.func,
    product: React.PropTypes.any,
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
  }

  componentWillMount() {
    const { pageIndex, pageSize } = this.state;
    const { cid } = this.props.location.query;
    this.props.fetchProduct('', pageIndex + 1, pageSize, cid);
  }

  componentDidMount() {
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    let count = 0;
    let size = 0;
    if (nextProps.product.success) {
      count = nextProps.product.data.count;
      size = nextProps.product.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
    this.setState({ pageIndex: 0 });
  }

  onItemClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    window.location.href = `/mall/product/details/${dataSet.modelid}`;
  }

  onTabItemClick = (e) => {
    const { pageIndex, pageSize } = this.state;
    const { cid } = this.props.location.query;
    const { type } = e.currentTarget.dataset;
    this.setState({
      activeTab: type,
      pageIndex: 0,
    });
    this.props.resetProducts();
    this.props.fetchProduct('', 1, pageSize, cid, type === 'price' ? 'price' : '');
  }

  onCategoryClick = (e) => {
    const { cid } = this.props.location.query;
    window.location.href = '/mall/product/categories' + (cid ? `?cid=${cid}` : '') + '&title=分类';
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const { fetchProduct, product } = this.props;
    const { cid } = this.props.location.query;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.product-list-tabs');
    if (scrollTop === documentHeight - windowHeight && !this.props.product.isLoading && this.state.hasMore) {
      this.props.fetchProduct('', pageIndex + 1, pageSize, cid, activeTab === 'price' ? 'price' : '');
    }
    if (scrollTop > tabsOffsetTop) {
      this.setState({ sticky: true });
    } else {
      this.setState({ sticky: false });
    }
  }

  addScrollListener = () => {
    window.addEventListener('scroll', this.onScroll);
  }

  removeScrollListener = () => {
    window.removeEventListener('scroll', this.onScroll);
  }

  render() {
    const { product } = this.props;
    const { title } = this.props.location.query;
    const products = product.data.results || [];
    const hasHeader = !utils.detector.isApp();
    const { activeTab, sticky } = this.state;
    return (
      <div className="product-list">
        <Header title={title} leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goSmartBack} rightText="分类" onRightBtnClick={this.onCategoryClick} hide={utils.detector.isApp()}/>
        <div className="content content-white-bg">
          <div className={'product-list-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
            <ul className="row no-margin">
              <li className={'col-xs-6' + (activeTab === 'default' ? ' active' : '')} data-type={'default'} onClick={this.onTabItemClick}>
                <div>推荐排序</div>
              </li>
              <li className={'col-xs-6' + (activeTab === 'price' ? ' active' : '')} data-type={'price'} onClick={this.onTabItemClick}>
                <div>价格排序</div>
              </li>
            </ul>
          </div>
          <div className="product-list-p" >
          <div className="margin-top-xxs" ></div>
            {products.map((item) => {
              return <Product key={item.id} product={item} onItemClick = {this.onItemClick} />;
            })}
          </div>
          {product.isLoading ? <Loader/> : null}
          <ShopBag />
          <BackTop />
        </div>
      </div>
    );
  }
}
