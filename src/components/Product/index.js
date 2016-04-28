import React, { Component } from 'react';
import LazyLoad from 'react-lazy-load';
import classnames from 'classnames';
import _ from 'underscore';
import placeholder from './images/placeholder-vertical.png';

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
      <div className="col-xs-6 col-sm-3 col-md-2 no-padding" onClick={this.props.onItemClick}>
        <div className="product text-center">
          <div className="product-picture">
            <img className={imageCls} src={product.head_img} onError={this.onImageLoadError}/>
          </div>
          <div className="product-info">
          <p className="product-name">{product.name}</p>
          <p>
            <span className="font-lg">{'￥' + product.agent_price}</span>
            <span className="font-grey">{'/￥' + product.std_sale_price}</span>
          </p>
          </div>
        </div>
      </div>
    );
  }
}
