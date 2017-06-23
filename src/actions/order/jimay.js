import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';
// 'COMMIT_ORDER',
export const names = {
  JIAMY_SHIPS: 'JIAMY_SHIPS',
  JIMAY_ORDER: 'JIMAY_ORDER',
  JIMAY_ORDERS: 'JIMAY_ORDERS',
  JIMAY_PAYINFO: 'JIMAY_PAYINFO',
};

export const commitJimayOrder = (params) => {
  const action = createAction(names.JIMAY_ORDER);
  window.ga && window.ga('send', {
    hitType: 'event',
    eventCategory: 'Pay',
    eventAction: 'Request',
    eventLabel: 'budget',
  });
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'jimay/order', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchJimayOrders = (params) => {
  const action = createAction(names.JIMAY_ORDERS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'jimay/order', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchJimayOrderApplyInfo = (device) => {
  const action = createAction(names.JIMAY_PAYINFO);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'jimay/order/pay_info', { params: { device: device } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchJimayAgentRelship = () => {
  const action = createAction(names.JIAMY_SHIPS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'jimay/agent/relationship')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const cancelJimayAgentOrder = (params) => {
  const action = createAction(names.JIMAY_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + `jimay/order/${params.id}/cancel`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
