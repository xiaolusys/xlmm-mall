import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'LOGIN';

export const login = (username, password, next) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(
        constants.baseEndpoint + 'register/customer_login',
        qs.stringify({ username: username, password: password })
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
