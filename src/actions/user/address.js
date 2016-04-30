import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'ADDRESS';

const action = createAction(name);

export const fetchAddress = (id) => {

  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'address' + (id ? '/' + id : ''))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};


export const updateAddress = (id, requestAction, address) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'address' + (id ? '/' + id : '') + '/' + requestAction, qs.stringify(address))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
