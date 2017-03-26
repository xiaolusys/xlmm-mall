import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';
import classnames from 'classnames';
import _ from 'underscore';
import placeholder from './../Product/images/placeholder-vertical.png';
import { Image } from 'components/Image';

import './index.scss';

export class CouponProduct extends Component {
  static propTypes = {
    product: React.PropTypes.object.isRequired,
    onItemClick: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    onItemClick: _.noop,
  }

  constructor(props) {
    super(props);
  }

  state = {
    imageLoadError: false,
  }

  onImageLoadError = (e) => {
    this.setState({
      imageLoadError: true,
    });
  }

  render() {
    const { product } = this.props;
    const imageCls = classnames({
      ['hide']: this.state.imageLoadError,
    });
    return (
      <div className="col-xs-6 col-sm-3 col-md-2 no-padding" data-modelid={product.id} onClick={this.props.onItemClick}>
        <div className="couponproduct text-center">
          <div className="product-picture">
            <Image className={imageCls} src={product.head_img} quality={90} thumbnail={200} onError={this.onImageLoadError}/>
          </div>
          <div className="product-info">
            <p className="product-name">{product.name}</p>
            <p>
              <span className="font-lg">{'￥' + product.agent_price}</span>
              <span className="font-grey">/</span>
              <span className="font-grey text-line-through">{'￥' + product.lowest_std_sale_price}</span>
              <span className="font-grey font-xs" style={{ paddingLeft: '8px' }}>{(product.elite_score) ? '积分' + product.elite_score : ''}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
