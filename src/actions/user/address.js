import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'ADDRESS';

const uri = constants.baseEndpoint;

export const fetchAddress = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(uri + 'address')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const deleteAddress = (id) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(uri + 'address/' + id + '/delete_address')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const changeDefautAddress = (id) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(uri + 'address/' + id + '/change_default')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const createAddress = (address) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(uri + 'address/create_address', qs.stringify({ address: address }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const updateAddress = (id, address) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(uri + 'address/' + id + '/update', qs.stringify({ address: address }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};