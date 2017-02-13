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
    const { prefixCls, status, couponItem, ...props } = this.props;
    return (
      <div className={`${prefixCls} ${couponStatus[status]} bottom-border`} {...props}>
        <div className="coupon-right-top">
          <p className={'no-margin coupon-value'}>{'¥' + couponItem.value}</p>
          <div className="coupon-detail">
            <p className="no-margin">{couponItem.pros_desc}</p>
            <p className="no-margin">{'满' + couponItem.use_fee + '可用'}</p>
          </div>
        </div>
        <p className="no-margin coupon-title">{couponItem.title}</p>
        <p className="coupon-validity">
        <span>期限 </span>
        <span className="coupon-date">{couponItem.start_use_time.replace('T', ' ').substring(0, 16)} </span>
        <span>至 </span>
        <span className="coupon-date">{couponItem.expires_time.replace('T', ' ').substring(0, 16)}</span>
        </p>
      </div>
    );
  }
}
