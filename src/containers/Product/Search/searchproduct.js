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
import * as searchAction from 'actions/product/search';
import * as plugins from 'plugins';

import './searchproduct.scss';

const actionCreators = _.extend(searchAction);

@connect(
  state => ({
    search: state.searchProduct,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class SearchProduct extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    location: React.PropTypes.object,
    search: React.PropTypes.object,
    searchProduct: React.PropTypes.func,
    resetSearchProduct: React.PropTypes.func,
    fetchSearchProductHistory: React.PropTypes.func,
    clearSearchProductHistory: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    searchFlag: false,
  }

  componentWillMount() {
    this.props.fetchSearchProductHistory();
  }

  componentWillReceiveProps(nextProps) {
    const { search } = nextProps;

    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else if (!nextProps.isLoading) {
      utils.ui.loadingSpinner.hide();
    }

    if (this.props.search.clearSearchHis.isLoading && !search.clearSearchHis.isLoading) {
      Toast.show(search.clearSearchHis.data.info);
    }

  }

  componentWillUnmount() {

  }

  onProductClick = (e) => {
    const { index, modelid } = e.currentTarget.dataset;
    this.context.router.push('/product/details/' + modelid);
  }

  onLeftBtnClick = (e) => {
    this.context.router.goBack();
  }

  onInputChange = (e) => {
    const value = e.target.value;
    this.setState({ searchName: value });
  }

  onSearchClick = (e) => {
    if (this.state.searchName && this.state.searchName.length > 0) {
      this.props.resetSearchProduct();
      this.props.searchProduct(this.state.searchName);
      this.setState({ searchFlag: true });
    }
  }

  delHis = (e) => {
    this.props.clearSearchProductHistory();
  }

  queryHis = (e) => {
    const { name } = e.currentTarget.dataset;
    this.props.searchProduct(name);
    this.setState({ searchFlag: true });
  }

  renderProduct = (product, index) => {
    const productDetails = product;

      return (
      <div key={index} className="col-xs-6 product-item bottom-border" data-index={index} data-modelid={product.id} onClick={this.onProductClick}>
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
      </div>
    );
  }

  render() {
    const { search } = this.props;

    return (
      <div className=" content-white-bg search-product-container">
        <InputHeader placeholder=" 输入查询的商品" onInputChange={this.onInputChange} leftIcon="icon-angle-left" onLeftBtnClick={this.onLeftBtnClick} rightText="搜索" onRightBtnClick={this.onSearchClick} />
        <div>
          <If condition={ !this.state.searchFlag}>
          <p className="search-history">
            <span>历史搜索</span>
            <span className="badge gold pull-right" onClick={this.delHis}>删除</span>
          </p>
          </If>
          <If condition={search.fetchSearchHis.success && search.fetchSearchHis.data && (search.fetchSearchHis.data.count > 0) && !this.state.searchFlag}>
            <ul className="his-search-result col-xs-12">
              {search.fetchSearchHis.data.results.map((item, index) => {
                return (
                  <li className="his-result-item text-center text col-xs-3" key={index} data-name={item.content} onClick={this.queryHis}>{item.content}</li>
                  );
              })
            }
            </ul>
          </If>
          <If condition={search.searchProduct.success && search.searchProduct.data && (search.searchProduct.data.count > 0) && this.state.searchFlag}>
          {search.searchProduct.data.results.map((item, index) => this.renderProduct(item, index))}
          </If>
          <If condition={search.searchProduct.success && search.searchProduct.data && (search.searchProduct.data.count === 0) && this.state.searchFlag}>
            <div className="empty-search">
              <p className="text-center">抱歉，商城没有您要查询的商品！</p>
            </div>
          </If>
        </div>
      </div>
    );
  }
}
