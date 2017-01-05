import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';

export const couponsNames = {
  FETCH_COUPONS_BY_STATUS: 'FETCH_COUPONS_BY_STATUS',
  FETCH_NEGOTIABLE_COUPONS: 'FETCH_NEGOTIABLE_COUPONS',
  APPLY_NEGOTIABLE_COUPONS: 'APPLY_NEGOTIABLE_COUPONS',
  FETCH_UNUSED_BOTIQUE_COUPONS: 'FETCH_UNUSED_BOTIQUE_COUPONS',
  FETCH_FREEZED_BOTIQUE_COUPONS: 'FETCH_FREEZED_BOTIQUE_COUPONS',
  APPLY_RETURN_COUPONS: 'APPLY_RETURN_COUPONS',
};

export const fetchCouponsByStatus = (status, couponType = null, page = 1) => {
  let name = '';
  if (couponType) {
    name = couponsNames.FETCH_NEGOTIABLE_COUPONS;
  } else {
    name = couponsNames.FETCH_COUPONS_BY_STATUS;
  }
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'usercoupon', { params: { page: page, coupon_type: couponType, status: status } })
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
  const action = createAction(couponsNames.APPLY_NEGOTIABLE_COUPONS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'mama/trancoupon/start_transfer', qs.stringify({ product_id: productId, coupon_num: num }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchUnusedBoutiqueCoupons = () => {
  const action = createAction(couponsNames.FETCH_UNUSED_BOTIQUE_COUPONS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'usercoupon/get_unused_boutique_coupons')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetUnusedBoutiqueCoupons = () => {
  const action = createAction(couponsNames.FETCH_UNUSED_BOTIQUE_COUPONS);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const fetchFreezedBoutiqueCoupons = (page) => {
  const action = createAction(couponsNames.FETCH_FREEZED_BOTIQUE_COUPONS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'usercoupon', { params: { page: page, coupon_type: 8, status: 2 } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetFreezedBoutiqueCoupons = () => {
  const action = createAction(couponsNames.FETCH_FREEZED_BOTIQUE_COUPONS);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const applyReturnCoupons = (ids, type) => {
  const action = createAction(couponsNames.APPLY_RETURN_COUPONS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'usercoupon/apply_return_boutique_coupons', qs.stringify({ coupon_ids: ids, return_to: type }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
