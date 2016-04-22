import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import './index.scss';

export class Slide extends Component {
  static propTypes = {};

  static defaultProps = {}

  constructor(props) {
    super(props);
  }

  state = {}

  render() {
    const props = this.props;
    return (
      <nav className="slide-menu">
        <div className="row no-margin">
          <div className="col-xs-4 col-xs-offset-4">
            <div className="avatar">
              <i className="icon-avatar icon-xiaolu icon-grey icon-3x"></i>
            </div>
          </div>
        </div>
        <div className="row no-margin">
          <div className="col-xs-4">
            <p></p>
            <p>
              <i className="icon-wallet"></i>
              <span>钱包(元)</span>
            </p>
          </div>
          <div className="col-xs-4">
            <p></p>
            <p>
              <i className="icon-database"></i>
              <span>积分</span>
            </p>
          </div>
          <div className="col-xs-4">
            <p></p>
            <p>
              <i className="icon-coupon-o"></i>
              <span>优惠券</span>
            </p>
          </div>
        </div>
        <ul>
          <li>
            <a>
              <i className="icon-order-square icon-gold"></i>
              <span>待支付</span>
            </a>
          </li>
          <li>
            <a>
              <i className="icon-truck icon-gold"></i>
              <span>待收货</span>
            </a>
          </li>
          <li>
            <a>
              <i className="icon-cny icon-gold"></i>
              <span>退换货</span>
            </a>
          </li>
          <li>
            <a>
              <i className="icon-order icon-gold"></i>
              <span>全部订单</span>
            </a>
          </li>
          <li>
            <a>
              <i className="icon-mail-open icon-gold"></i>
              <span>投诉建议</span>
            </a>
          </li>
          <li>
            <a href="/#/faq">
              <i className="icon-faq icon-gold"></i>
              <span>常见问题</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
