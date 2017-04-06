import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';

export const names = {
  FETCH_CASHOUT_LIST: 'FETCH_CASHOUT_LIST',
  CASHOUT: 'CASHOUT',
  FETCH_CASHOUT_POLICY: 'FETCH_CASHOUT_POLICY',
  REQUEST_CASHOUT_VERIFY_CODE: 'REQUEST_CASHOUT_VERIFY_CODE',
};

export const fetchCashoutList = (pageIndex, pageSize) => {
  const action = createAction(names.FETCH_CASHOUT_LIST);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'users/get_budget_detail', { params: { page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetCashoutList = () => {
  const action = createAction(names.FETCH_CASHOUT_LIST);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const cashout = (amount, verifyCode, channel, name) => {
  const action = createAction(names.CASHOUT);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'users/budget_cash_out', qs.stringify({ cashout_amount: amount, verify_code: verifyCode, channel: channel, name: name }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetCashout = () => {
  const action = createAction(names.CASHOUT);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const fetchCashoutPolicy = () => {
  const action = createAction(names.FETCH_CASHOUT_POLICY);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'cashout_policy')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const reqCashoutVerifyCode = () => {
  const action = createAction(names.REQUEST_CASHOUT_VERIFY_CODE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'request_cashout_verify_code')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
