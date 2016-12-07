import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const boutiqueCouponNames = {
  FETCH_MAMA_TRANCOUPON: 'FETCH_MAMA_TRANCOUPON',
  FETCH_MAMA_LEFT_TRANCOUPON: 'FETCH_MAMA_LEFT_TRANCOUPON',
  FETCH_CAN_EXCHG_ORDERS: 'FETCH_CAN_EXCHG_ORDERS',
  EXCHG_ORDER: 'EXCHG_ORDER',
  VERIFY_RETURN_COUPON: 'VERIFY_RETURN_COUPON',
  FETCH_RETURN_COUPON_TO_ME: 'FETCH_RETURN_COUPON_TO_ME',
  FETCH_MY_RETURN_COUPON: 'FETCH_MY_RETURN_COUPON',
  RETURN_FREEZE_COUPONS: 'RETURN_FREEZE_COUPONS',
};

export const fetchMamaTranCouponProfile = () => {
  const action = createAction(boutiqueCouponNames.FETCH_MAMA_TRANCOUPON);
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
  const action = createAction(boutiqueCouponNames.FETCH_MAMA_LEFT_TRANCOUPON);
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
  const action = createAction(boutiqueCouponNames.FETCH_CAN_EXCHG_ORDERS);
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

export const resetCanExchgOrders = () => {
  const action = createAction(boutiqueCouponNames.FETCH_CAN_EXCHG_ORDERS);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const exchgOrder = (orderId, templateId, num) => {
  const action = createAction(boutiqueCouponNames.EXCHG_ORDER);
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

export const verifyReturnCoupon = (id, type) => {
  const action = createAction(boutiqueCouponNames.VERIFY_RETURN_COUPON);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(`${constants.baseEndpoint}trancoupon/verify_return_transfer_record`, qs.stringify({ transfer_record_id: id, verify_func: type }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchReturnCouponToMe = (pageIndex, pageSize) => {
  const action = createAction(boutiqueCouponNames.FETCH_RETURN_COUPON_TO_ME);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}trancoupon/list_return_transfer_record`, { params: { page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetReturnCouponToMe = () => {
  const action = createAction(boutiqueCouponNames.FETCH_RETURN_COUPON_TO_ME);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const fetchMyReturnCoupon = (pageIndex, pageSize) => {
  const action = createAction(boutiqueCouponNames.FETCH_MY_RETURN_COUPON);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}trancoupon/list_apply_transfer_record`, { params: { page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetMyReturnCoupon = () => {
  const action = createAction(boutiqueCouponNames.FETCH_MY_RETURN_COUPON);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const returnFreezeCoupons = (id) => {
  const action = createAction(boutiqueCouponNames.RETURN_FREEZE_COUPONS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'trancoupon/return_transfer_coupon_2_upper', qs.stringify({ transfer_record_id: id }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
