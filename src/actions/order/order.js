import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const names = {
  FETCH_ORDER: 'FETCH_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  CHARGE_ORDER: 'CHARGE_ORDER',
};

export const fetchOrders = (type, pageIndex, pageSize) => {
  const action = createAction(names.FETCH_ORDER);
  const uri = constants.baseEndpoint + 'trades' + (type ? '/' + type : '');
  const params = { params: { page: pageIndex, pageSize: pageSize } };
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(uri, params)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const fetchOrder = (id) => {
  const action = createAction(names.FETCH_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'trades/' + id)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const deleteOrder = (id) => {
  const action = createAction(names.DELETE_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.delete(constants.baseEndpoint + 'trades/' + id)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const chargeOrder = (id) => {
  const action = createAction(names.DELETE_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'trades/' + id +'/charge')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
