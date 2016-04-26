import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

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

export const saveProfile = (profile) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.patch(constants.baseEndpointV1 + 'users/' + profile.id, qs.stringify({ nick: profile.nick }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
