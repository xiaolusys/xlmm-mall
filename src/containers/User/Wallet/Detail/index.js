import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as utils from 'utils';
import * as constants from 'constants';

import { Image } from 'components/Image';
import { Product } from 'components/Product';
import { Loader } from 'components/Loader';
import { Toast } from 'components/Toast';
import { If } from 'jsx-control-statements';
import { Header } from 'components/Header';
import * as actionCreators from 'actions/favorite/index';

import './index.scss';

@connect(
  state => ({
    favorite: state.favorite,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Detail extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    order: React.PropTypes.any,
    params: React.PropTypes.any,
    isLoading: React.PropTypes.bool,
    favorite: React.PropTypes.any,
    fetchFavoriteList: React.PropTypes.func,
    resetFavorite: React.PropTypes.func,
    addFavorite: React.PropTypes.func,
    unFavorite: React.PropTypes.func,
    resetAddFavorite: React.PropTypes.func,
    resetUnFavorite: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    pageIndex: 0,
    pageSize: 20,
    hasMore: true,
    sticky: false,
    activeTab: 'onSale',
    favoriteStatus: false,
  }

  componentWillMount() {
    const { pageIndex, pageSize, activeTab } = this.state;
    this.props.fetchFavoriteList(pageIndex + 1, pageSize, (activeTab === 'onSale' ? 'on' : 'off'));
  }

  componentDidMount() {
    this.props.resetFavorite();
    this.props.resetUnFavorite();
    this.props.resetAddFavorite();
    this.addScrollListener();
  }

  componentWillReceiveProps(nextProps) {
    const { pageIndex, pageSize, activeTab } = this.state;
    const { favorite } = nextProps;
    const { fetchfavorite, unFavorite } = favorite;
    if (fetchfavorite.success) {
      const count = fetchfavorite.data.count;
      const size = fetchfavorite.data.results.length;
      this.setState({ pageIndex: Math.round(size / this.state.pageSize) });
      this.setState({ hasMore: count > size });
    }
    if (unFavorite.success && unFavorite.data.code >= 0) {
      Toast.show(unFavorite.data.info);
    }
  }

  componentWillUnmount() {
    this.removeScrollListener();
  }

  onTabItemClick = (e) => {
    const { pageIndex, pageSize, activeTab } = this.state;
    const { id } = e.currentTarget;
    this.setState({ activeTab: id });
    if (id === 'onSale') {
      this.props.resetFavorite();
      this.props.fetchFavoriteList(1, pageSize, 'on');
    }
    if (id === 'soldOut') {
      this.props.resetFavorite();
      this.props.fetchFavoriteList(1, pageSize, 'off');
    }
    e.preventDefault();
  }

  onFavoriteBtnClick = (e) => {
    const { modelid } = e.currentTarget.dataset;
    const { activeTab } = this.state;
    this.props.resetFavorite();
    this.props.unFavorite(Number(modelid), true, (activeTab === 'onSale' ? 'on' : 'off'));
    e.preventDefault();
  }

  onProductClick = (e) => {
    const dataSet = e.currentTarget.dataset;
    window.location.href = `/mall/product/details/${dataSet.modelid}?modelid=${dataSet.modelid}`;
    e.preventDefault();
  }

  onScroll = (e) => {
    const { pageSize, pageIndex, activeTab } = this.state;
    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const documentHeight = utils.dom.documnetHeight();
    const windowHeight = utils.dom.windowHeight();
    const tabsOffsetTop = utils.dom.offsetTop('.favorite-tabs');
    if (scrollTop === documentHeight - windowHeight && !this.props.favorite.fetchfavorite.isLoading && this.state.hasMore) {
      this.props.fetchFavoriteList(pageIndex + 1, pageSize, (activeTab === 'onSale' ? 'on' : 'off'));
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

  renderFavorites(favorites) {
    const { activeTab, sticky, favoriteStatus } = this.state;
    return (
      favorites.map((item, index) => {
        return (
          <div key={index} className="col-xs-6 col-sm-3 col-md-2 no-padding">
            <div className="product">
              <div className="product-picture" data-modelid={item.modelproduct.id} onClick={this.onProductClick}>
                <LazyLoad throttle={200}>
                  <Image className={''} src={item.modelproduct.head_img} thumbnail={200}/>
                </LazyLoad>
              </div>
              <div className="product-info">
                <p className="row no-margin">
                  <span className="col-xs-9 no-padding no-wrap text-left">{item.modelproduct.name}</span>
                  <i className="col-xs-3 icon-favorite-yes font-lg text-left" data-modelid={item.modelproduct.id} onClick={this.onFavoriteBtnClick}></i>
                </p>
                <p>
                  <span className="font-lg">{'￥' + item.modelproduct.lowest_agent_price}</span>
                  <span className="font-grey">/</span>
                  <span className="font-grey text-line-through">{'￥' + item.modelproduct.lowest_std_sale_price}</span>
                </p>
              </div>
            </div>
          </div>
        );
      })
    );
  }

  render() {
    const { activeTab, sticky, favoriteStatus } = this.state;
    const hasHeader = !utils.detector.isApp();
    const { fetchfavorite } = this.props.favorite;
    const data = fetchfavorite.data.results || [];
    return (
      <div>
        <Header title="我的收藏" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
          <div className="content favorite-container">
            <div className={'favorite-tabs text-center bottom-border ' + (sticky ? 'sticky ' : '') + (hasHeader ? 'has-header' : '')}>
              <ul className="row no-margin">
                <li id="onSale" className={'col-xs-6' + (activeTab === 'onSale' ? ' active' : '')} onClick={this.onTabItemClick}>
                  <p className="no-margin">热销商品</p>
                </li>
                <li id="soldOut" className={'col-xs-6' + (activeTab === 'soldOut' ? ' active' : '')} onClick={this.onTabItemClick}>
                  <p className="no-margin">未上架商品</p>
                </li>
              </ul>
            </div>
            <If condition={!_.isEmpty(data)}>
              {this.renderFavorites(data)}
            </If>
          </div>
      </div>
    );
  }
}
