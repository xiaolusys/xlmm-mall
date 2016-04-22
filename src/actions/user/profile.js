import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'PROFILE';

export const fetchProfile = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'users/profile')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
