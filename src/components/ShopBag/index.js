import React, { Component } from 'react';
import { Link } from 'react-router';

import './index.scss';

export class ShopBag extends Component {

  render() {
    return (<Link className="shop-bag" to="/shop/bag"><i className="icon-cart icon-yellow icon-2x"></i></Link>);
  }
}
