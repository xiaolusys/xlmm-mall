import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'USERS';

export const fetchUsers = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'users')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
