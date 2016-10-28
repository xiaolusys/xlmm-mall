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

const payTypeIcons = {
  wx_pub: 'icon-wechat-pay icon-wechat-green',
  alipay_wap: 'icon-alipay-square icon-alipay-blue',
};

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
    this.context.router.push('/buycoupon?index=' + index);
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
            <p className="col-xs-6 no-padding">
              <span className="font-xs">{'￥' + (sku ? sku.agent_price : '')}</span>
              <span className="font-grey">/</span>
              <span className="font-xs font-grey-light text-line-through">{'￥' + (sku ? sku.std_sale_price : '')}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { productDetails, mamaInfo } = this.props;

    return (
      <div className=" content-white-bg buycoupon">
        <Header title="入券" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
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
