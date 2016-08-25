import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'FETCH_ADMINISTRATOR_INFO';

const action = createAction(name);

export const fetchAdministratorInfo = () => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/administrator`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
