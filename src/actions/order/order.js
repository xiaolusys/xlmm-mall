import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const names = {
  FETCH_ORDER: 'FETCH_ORDER',
  FETCH_ORDERS: 'FETCH_ORDERS',
  RESET_ORDERS: 'RESET_ORDERS',
  DELETE_ORDER: 'DELETE_ORDER',
  CHARGE_ORDER: 'CHARGE_ORDER',
  CONFIRM_RECEIVED_ORDER: 'CONFIRM_RECEIVED_ORDER',
  REMIND_SHIPMENT: 'REMIND_SHIPMENT',
};
const fetchOrdersAction = createAction(names.FETCH_ORDERS);
export const fetchOrders = (type, pageIndex, pageSize) => {
  const uri = constants.baseEndpoint + 'trades' + (type ? '/' + type : '');
  const params = { params: { page: pageIndex, pageSize: pageSize } };
  return (dispatch) => {
    dispatch(fetchOrdersAction.request());
    return axios.get(uri, params)
      .then((resp) => {
        dispatch(fetchOrdersAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(fetchOrdersAction.failure(resp.data));
      });
  };
};

export const resetOrders = () => {
  return (dispatch) => {
    dispatch(fetchOrdersAction.reset());
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
    return axios.delete(constants.baseEndpoint + 'trades/' + id + 'undisplay')
      .then((resp) => {
        dispatch(action.success(resp.data));
        dispatch(fetchOrders());
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const chargeOrder = (id) => {
  const action = createAction(names.CHARGE_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'trades/' + id + '/charge')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const confirmReceivedOrder = (id) => {
  const action = createAction(names.CONFIRM_RECEIVED_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'trades/' + id + '/confirm_sign')
      .then((resp) => {
        dispatch(action.success(resp.data));
        dispatch(fetchOrders());
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const remindShipment = (id) => {
  const action = createAction(names.REMIND_SHIPMENT);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'trades/' + id + '/remind_send')
      .then((resp) => {
        dispatch(action.success(resp.data));
        dispatch(fetchOrders());
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
