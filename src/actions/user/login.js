import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'LOGIN';

export const login = (username, password) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'register/customer_login', {
        params: {
          username: username,
          password: password,
        },
      })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
