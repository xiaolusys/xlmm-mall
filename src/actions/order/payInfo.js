import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'FETCH_PAY_INFO';

export const fetchPayInfo = (cartIds, couponId) => {
  const action = createAction(name);
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
