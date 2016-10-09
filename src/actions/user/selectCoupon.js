import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';
export const name = 'FETCH_COUPONS_BY_CARTID';
const action = createAction(name);

export const fetchCouponsByCartid = (cartid) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'usercoupons/coupon_able?cart_ids=' + cartid)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
