import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/faq/questions';
import _ from 'underscore';
import { Header } from 'components/Header';

import productsGroups from './products';

import './index.scss';

import banner from './images/banner.png';
import coupon from './images/coupon.png';
import footer from './images/footer.png';

@connect(
  state => ({
    data: state.coupon.data,
    isLoading: state.coupon.isLoading,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export default class Md20160508 extends Component {

  static propTypes = {
    images: React.PropTypes.string,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    images: './images/',
    couponIds: '42,43,44',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

  }

  onCouponClick = (e) => {

  }

  onProductClick = (e) => {

  }

  render() {
    const { images } = this.props;
    return (
      <div>
        <Header title="母亲节特惠" leftIcon="icon-angle-left" onLeftBtnClick={this.context.router.goBack} />
        <div className="content content-white-bg activity-md">
          <img className="col-md-4 col-md-offset-4 col-xs-12 no-padding" src={banner} />
          <img className="col-md-2 col-md-offset-5 col-xs-10 col-xs-offset-1 no-padding margin-top-sm" src={coupon} onClick={this.onCouponClick} />
          {productsGroups.map((group, index) => {
            return (
              <div key={index} className="margin-top-sm">
                <img className="col-md-2 col-md-offset-5 col-xs-6 col-xs-offset-3 no-padding margin-top-sm" src={require(`${images}${group.header}`)} />
                <ul>
                {group.products.map((product, i) => {
                  return (
                    <li className="col-md-2 col-md-offset-5 col-xs-6 activity-product" key={i} data-modelid={product.modleId} data-productid={product.productId} onClick={this.onProductClick}>
                      <img src={require(`${images}${product.pic}`)} />
                    </li>
                  );
                })}
                </ul>
              </div>
            );
          })}
          <img className="col-md-2 col-md-offset-5 col-xs-8 col-xs-offset-2 no-padding margin-top-md margin-bottom-sm" src={footer} />
        </div>
      </div>
    );
  }
}
