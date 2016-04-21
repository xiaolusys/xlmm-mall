import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import { push } from 'redux-router';
import qs from 'qs';

export const name = 'REGISTER';

export const register = (username, password, next) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(
        constants.baseEndpoint + 'register/customer_login',
        qs.stringify({ username: username, password: password })
      )
      .then((resp) => {
        if (resp.data.code === 0) {
          dispatch(action.success(resp.data));
          dispatch(push(next));
        } else {
          dispatch(action.failure(resp.data));
        }
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
