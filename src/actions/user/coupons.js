import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';

export const names = {
  FETCH_COUPONS_BY_STATUS: 'FETCH_COUPONS_BY_STATUS',
  FETCH_NEGOTIABLE_COUPONS: 'FETCH_NEGOTIABLE_COUPONS',
  APPLY_NEGOTIABLE_COUPONS: 'APPLY_NEGOTIABLE_COUPONS',
};

export const fetchCouponsByStatus = (status, couponType = null) => {
  let name = '';
  if (couponType) {
    name = names.FETCH_NEGOTIABLE_COUPONS;
  } else {
    name = names.FETCH_COUPONS_BY_STATUS;
  }
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'usercoupons/get_user_coupons?status=' + status
              + (couponType ? ('&coupon_type=' + couponType) : ''))
      .then((resp) => {
        const data = resp.data;
        data.status = status;
        data.coupons = resp.data;
        dispatch(action.success(data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const applyNegotiableCoupons = (productId, num) => {
  const action = createAction(names.APPLY_NEGOTIABLE_COUPONS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'mama/trancoupon/start_transfer?product_id=' + productId
              + ('&coupon_num=' + num))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
