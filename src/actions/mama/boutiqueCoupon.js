import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  FETCH_MAMA_TRANCOUPON: 'FETCH_MAMA_TRANCOUPON',
  FETCH_MAMA_LEFT_TRANCOUPON: 'FETCH_MAMA_LEFT_TRANCOUPON',
};

export const fetchMamaTranCouponProfile = () => {
  const action = createAction(names.FETCH_MAMA_TRANCOUPON);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/trancoupon/profile`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMamaLeftTranCoupon = () => {
  const action = createAction(names.FETCH_MAMA_LEFT_TRANCOUPON);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/trancoupon/list_mama_left_coupons`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
