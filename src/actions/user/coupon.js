import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const name = 'FETCH_COUPON';

const action = createAction(name);

export const receiveCoupon = (couponIds) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'usercoupons', qs.stringify({ template_id: couponIds }))
      .then((resp) => {
        dispatch(action.success(resp.data));
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
