import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'FETCH_PAY_INFO';

export const fetchPayInfo = (cartIds, couponId, device) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'carts/carts_payinfo', { params: { cart_ids: cartIds, coupon_id: couponId, device: device } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchBuyNowPayInfo = (skuid, num, device) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'carts/now_payinfo', { params: { sku_id: skuid, num: num, device: device } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
