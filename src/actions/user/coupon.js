import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';
import * as districtAction from 'actions/user/district';

export const name = 'FETCH_COUPON';

const action = createAction(name);

export const fetchCoupon = (couponIds) => {
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


export const resetCoupon = () => {
  return (dispatch) => {
    dispatch(action.request());
  };
};
