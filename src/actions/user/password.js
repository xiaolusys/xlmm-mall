import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'PASSWORD';

export const setPassword = (phone, verifyCode, password, repeatedPassword) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(
        constants.baseEndpoint + 'reset_password',
        qs.stringify({ mobile: phone, verify_code: verifyCode, password1: password, password2: repeatedPassword })
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
