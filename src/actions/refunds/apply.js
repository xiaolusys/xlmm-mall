
import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'PUSH_REFUNDS_APPLY';

export const getOrderById = (tradeId, orderId) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'trades/' + tradeId + '/orders/' + orderId)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const pushRefundsApply = (params) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'refunds', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
