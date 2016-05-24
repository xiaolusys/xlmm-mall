import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  FETCH_VERIFY_CODE: 'FETCH_VERIFY_CODE',
  VERIFY: 'VERIFY',
};

export const fetchVerifyCode = (phone, requestAction) => {
  const action = createAction(names.FETCH_VERIFY_CODE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(
        constants.baseEndpoint + 'send_code',
        qs.stringify({ mobile: phone, action: requestAction })
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const verify = (phone, verifyCode, requestAction) => {
  const action = createAction(names.VERIFY);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(
        constants.baseEndpoint + 'verify_code',
        qs.stringify({ mobile: phone, verify_code: verifyCode, action: requestAction })
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetVerifyState = () => {
  const action = createAction(names.VERIFY);
  return (dispatch) => {
    dispatch(action.request());
  };
};

export const resetFetchState = () => {
  const action = createAction(names.FETCH_VERIFY_CODE);
  return (dispatch) => {
    dispatch(action.request());
  };
};
