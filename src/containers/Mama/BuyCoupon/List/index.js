import React, { Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Header } from 'components/Header';
import { Image } from 'components/Image';
import { Checkbox } from 'components/Checkbox';
import { Input } from 'components/Input';
import { Toast } from 'components/Toast';
import { Popup } from 'components/Popup';
import { If } from 'jsx-control-statements';
import * as utils from 'utils';
import * as mamaInfoAction from 'actions/mama/mamaInfo';
import * as detailsAction from 'actions/product/details';
import * as plugins from 'plugins';

import './index.scss';

const actionCreators = _.extend(mamaInfoAction, detailsAction);

@connect(
  state => ({
    mamaInfo: state.mamaInfo,
    productDetails: state.productDetails,
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
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

  }

  componentWillMount() {
    this.props.fetchVirtualProductDetails();
    this.props.fetchMamaInfo();
  }

  componentWillReceiveProps(nextProps) {
    const { mamaInfo, productDetails } = nextProps;
    if (nextProps.isLoading) {
      utils.ui.loadingSpinner.show();
    } else if (!nextProps.isLoading) {
      utils.ui.loadingSpinner.hide();
    }
  }

  componentWillUnmount() {

  }

  onProductClick = (e) => {
    const { index } = e.currentTarget.dataset;
    const modelid = this.props.productDetails.data[index].id;
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

  renderProduct = (product, index) => {
    const { mamaInfo } = this.props;
    const productDetails = product;
    const imgSrc = (productDetails && productDetails.detail_content) ? productDetails.detail_content.head_img : '';
    let sku = null;

    for (let i = 0; i < productDetails.sku_info.length; i++) {
      if (productDetails.sku_info[i].name.indexOf(mamaInfo.data[0].elite_level) >= 0) {
        sku = productDetails.sku_info[i];
        break;
      }
    }

    return (
      <div key={index} className="col-xs-6 product-item bottom-border" data-index={index} onClick={this.onProductClick}>
        <Image className="coupon-img" src={imgSrc} quality={70} />
        <div className="product-info bg-white">
          <div className="row no-margin">
            <p className="no-padding no-wrap font-xs">{(productDetails.detail_content && sku) ? productDetails.detail_content.name + '/' + sku.name : '' }</p>
          </div>
          <div className="row no-margin">
            <p className="">
              <span className="font-xs">{'￥' + (sku ? sku.agent_price : '')}</span>
              <span className="font-grey">/</span>
              <span className="font-xs font-grey-light text-line-through">{'￥' + (sku ? sku.std_sale_price : '')}</span>
              <span className="font-grey font-xs" style={{ paddingLeft: '8px' }}>{(sku) ? '积分' + sku.elite_score : ''}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { productDetails, mamaInfo } = this.props;
    const trasparentHeader = true;

    return (
      <div className=" content-white-bg buycoupon">
        <Header trasparent={trasparentHeader} title="入券" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div>
        <If condition={productDetails.success && productDetails.data && mamaInfo.success && mamaInfo.data}>
          {productDetails.data.map((item, index) => this.renderProduct(item, index))
          }
        </If>
        </div>
      </div>
    );
  }
}
