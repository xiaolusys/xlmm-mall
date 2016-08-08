import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';
import classnames from 'classnames';
import _ from 'underscore';
import placeholder from './images/placeholder-vertical.png';
import { Image } from 'components/Image';

import './index.scss';

export class Product extends Component {
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
      <div className="col-xs-6 col-sm-3 col-md-2 no-padding" data-productid={product.id} data-modelid={product.model_id} onClick={this.props.onItemClick}>
        <div className="product text-center">
          <div className="product-picture">
            <LazyLoad throttle={200}>
              <Image className={imageCls} src={product.head_img} thumbnail={200} onError={this.onImageLoadError}/>
            </LazyLoad>
            <If condition={product.is_saleout}>
              <div className="product-tips"><p>已抢光</p></div>
            </If>
            <If condition={!product.is_saleopen}>
              <div className="product-tips"><p>即将开售</p></div>
            </If>
          </div>
          <div className="product-info">
            <p className="product-name">{product.name}</p>
            <p>
              <span className="font-lg">{'￥' + product.lowest_price}</span>
              <span className="font-grey">/</span>
              <span className="font-grey text-line-through">{'￥' + product.std_sale_price}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
