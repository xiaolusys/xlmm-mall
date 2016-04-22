import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'VERIFY_CODE';

export const fetchVerifyCode = (phone, requestAction) => {
  const action = createAction(name);
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
        dispatch(action.failure(resp.data));
      });
  };
};

export const verify = (phone, verifyCode, requestAction) => {
  const action = createAction(name);
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
        dispatch(action.failure(resp.data));
      });
  };
};
