import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const name = 'FETCH_VERIFY_COUPON';

const action = createAction(name);

export const fetchVerifyCoupon = (cartIds, couponId) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'carts/carts_payinfo', { params: { cart_ids: cartIds, coupon_id: couponId } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
