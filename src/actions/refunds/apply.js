import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = { REFUNDS_APPLY: 'REFUNDS_APPLY', FETCH_ORDER: 'FETCH_ORDER' };

const fetchOrderAction = createAction(names.FETCH_ORDER);
const pushApplyAction = createAction(names.REFUNDS_APPLY);

export const fetchOrderById = (tradeId, orderId) => {
  return (dispatch) => {
    dispatch(fetchOrderAction.request());
    return axios.get(constants.baseEndpointV1 + 'trades/' + tradeId + '/orders/' + orderId)
      .then((resp) => {
        dispatch(fetchOrderAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(fetchOrderAction.failure(resp));
      });
  };
};

export const pushRefundsApply = (params) => {
  return (dispatch) => {
    dispatch(pushApplyAction.request());
    return axios.post(constants.baseEndpointV1 + 'refunds', qs.stringify(params))
      .then((resp) => {
        dispatch(pushApplyAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(pushApplyAction.failure(resp));
      });
  };
};

export const resetApply = () => {
  return (dispatch) => {
    dispatch(pushApplyAction.reset());
  };
};

export const resetOrder = () => {
  return (dispatch) => {
    dispatch(fetchOrderAction.reset());
  };
};
