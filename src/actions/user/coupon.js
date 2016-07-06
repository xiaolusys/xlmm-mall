import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';
import * as topTenAction from 'actions/activity/topTen';

export const name = 'FETCH_COUPON';

const action = createAction(name);

export const receiveCoupon = (couponIds, activityId) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'usercoupons', qs.stringify({ template_id: couponIds }))
      .then((resp) => {
        dispatch(action.success(resp.data));
        dispatch(topTenAction.fetchTopTen(activityId));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const fetchCouponById = (couponId) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'usercoupons/' + couponId)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};


export const resetCoupon = () => {
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const verifyCoupon = (cartIds, couponId) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'carts/carts_payinfo', { params: { cart_ids: cartIds, coupon_id: couponId } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
