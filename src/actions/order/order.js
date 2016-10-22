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
const remindShipmentAction = createAction(names.REMIND_SHIPMENT);
const deleteOrderAction = createAction(names.DELETE_ORDER);
const chargeOrderaction = createAction(names.CHARGE_ORDER);

export const fetchOrders = (type, pageIndex, pageSize) => {
  const uri = constants.baseEndpoint + 'trades' + (type ? '/' + type : '');
  const params = { params: { page: pageIndex, page_size: pageSize } };
  return (dispatch) => {
    dispatch(fetchOrdersAction.request());
    return axios.get(uri, params)
      .then((resp) => {
        dispatch(fetchOrdersAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(fetchOrdersAction.failure(resp));
      });
  };
};

export const resetOrders = () => {
  return (dispatch) => {
    dispatch(fetchOrdersAction.reset());
  };
};

export const fetchOrder = (tradeId) => {
  const action = createAction(names.FETCH_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'trades/' + tradeId)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const deleteOrder = (tradeId) => {
  return (dispatch) => {
    dispatch(deleteOrderAction.request());
    return axios.delete(constants.baseEndpoint + 'trades/' + tradeId)
      .then((resp) => {
        dispatch(deleteOrderAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(deleteOrderAction.failure(resp));
      });
  };
};

export const resetDeleteOrder = () => {
  return (dispatch) => {
    dispatch(deleteOrderAction.reset());
  };
};

export const chargeOrder = (tradeId) => {
  return (dispatch) => {
    dispatch(chargeOrderaction.request());
    return axios.post(constants.baseEndpoint + 'trades/' + tradeId + '/charge')
      .then((resp) => {
        dispatch(chargeOrderaction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(chargeOrderaction.failure(resp));
      });
  };
};

export const resetChargeOrder = () => {
  return (dispatch) => {
    dispatch(chargeOrderaction.reset());
  };
};

export const confirmReceivedOrder = (tradeId, orderId) => {
  const action = createAction(names.CONFIRM_RECEIVED_ORDER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'orders/' + orderId + '/confirm_sign')
      .then((resp) => {
        dispatch(action.success(resp.data));
        dispatch(fetchOrder(tradeId));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const remindShipment = (tradeId) => {

  return (dispatch) => {
    dispatch(remindShipmentAction.request());
    return axios.post(constants.baseEndpoint + 'trades/' + tradeId + '/remind_send')
      .then((resp) => {
        dispatch(remindShipmentAction.success(resp.data));
        dispatch(fetchOrders());
      })
      .catch((resp) => {
        dispatch(remindShipmentAction.failure(resp));
      });
  };
};

export const resetRemindShipment = () => {
  return (dispatch) => {
    dispatch(remindShipmentAction.reset());
  };
};
