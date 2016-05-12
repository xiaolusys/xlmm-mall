import React, { Component } from 'react';
import './index.scss';

const couponStatus = {
  0: 'available',
  1: 'used',
  2: 'unavailable',
  3: 'expired',
  4: 'selected',
};

export class Coupon extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    status: React.PropTypes.any,
    couponItem: React.PropTypes.any,
  }

  static defaultProps = {
    prefixCls: 'coupon',
    status: '',
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { prefixCls, status, couponItem } = this.props;
    console.log(couponItem);
    return (
      <div className={`${prefixCls} ${couponStatus[status]}`}>
        <div className="coupon-right-top">
          <p className={'no-margin coupon-value'}>{'¥' + couponItem.coupon_value}</p>
          <div className="coupon-detail">
            <p className="no-margin">{couponItem.use_fee_des}</p>
            <p className="no-margin">{couponItem.pros_desc}</p>
          </div>
        </div>
        <p className="coupon-validity">
        <span>期限 </span>
        <span className="coupon-date">{couponItem.start_time.replace('T', ' ').substring(0, 16)} </span>
        <span>至 </span>
        <span className="coupon-date">{couponItem.deadline.replace('T', ' ').substring(0, 16)}</span>
        </p>
      </div>
    );
  }
}
