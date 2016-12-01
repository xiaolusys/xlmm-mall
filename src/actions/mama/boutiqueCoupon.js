import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  FETCH_MAMA_TRANCOUPON: 'FETCH_MAMA_TRANCOUPON',
  FETCH_MAMA_LEFT_TRANCOUPON: 'FETCH_MAMA_LEFT_TRANCOUPON',
  FETCH_CAN_EXCHG_ORDERS: 'FETCH_CAN_EXCHG_ORDERS',
  EXCHG_ORDER: 'EXCHG_ORDER',
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

export const fetchCanExchgOrders = () => {
  const action = createAction(names.FETCH_CAN_EXCHG_ORDERS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/exchgorder/list_can_exchg_orders`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const exchgOrder = (orderId, templateId, num) => {
  const action = createAction(names.EXCHG_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(`${constants.baseEndpoint}mama/exchgorder/start_exchange`, qs.stringify({ order_id: orderId, exchg_template_id: templateId, coupon_num: num }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
