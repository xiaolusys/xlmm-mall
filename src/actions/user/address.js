import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';
import * as provinceAction from 'actions/user/province';

export const name = 'ADDRESS';

const action = createAction(name);

export const fetchAddress = (id, isEdit = false) => {

  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'address' + (id ? '/' + id : ''))
      .then((resp) => {
        dispatch(action.success(resp.data));
        if (isEdit) {
          dispatch(provinceAction.fetchProvinces(resp.data));
        }
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const updateAddress = (id, requestAction, address) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'address' + (id ? '/' + id : '') + '/' + requestAction, qs.stringify(address))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const deleteAddress = (id) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'address/' + id + '/delete_address')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
