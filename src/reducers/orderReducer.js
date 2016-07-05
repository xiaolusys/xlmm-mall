import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as orderAction from 'actions/order/order';

const initState = {
  fetchOrders: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  fetchOrder: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  deleteOrder: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  chargeOrder: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  confirmReceivedOrder: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  remindShipment: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case orderAction.names.FETCH_ORDERS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        fetchOrders: { isLoading: true, data: state.fetchOrders.data, error: false, success: false },
      });
    case orderAction.names.FETCH_ORDERS + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.fetchOrders.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        fetchOrders: { isLoading: false, data: payload, error: false, success: true },
      });
    case orderAction.names.FETCH_ORDERS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        fetchOrders: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case orderAction.names.FETCH_ORDERS + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        fetchOrders: { isLoading: false, data: action.payload, error: false, success: false },
      });
    case orderAction.names.FETCH_ORDER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        fetchOrder: { isLoading: true, data: {}, error: false, success: false },
      });
    case orderAction.names.FETCH_ORDER + '_' + actionTypes.SUCCESS:
      const payloads = action.payload;
      _.map(payloads.orders, function(order, index) {
        _.extend(order, (_.where(payloads.package_orders, { id: order.package_order_id })[0] || {}));
      });
      payloads.orders = _.groupBy(action.payload.orders, 'package_order_id');
      return _.extend({}, state, {
        fetchOrder: { isLoading: false, data: payloads, error: false, success: true },
      });
    case orderAction.names.FETCH_ORDER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        fetchOrder: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case orderAction.names.DELETE_ORDER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        deleteOrder: { isLoading: true, data: {}, error: false, success: false },
      });
    case orderAction.names.DELETE_ORDER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        deleteOrder: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case orderAction.names.DELETE_ORDER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        deleteOrder: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case orderAction.names.CHARGE_ORDER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        chargeOrder: { isLoading: true, data: {}, error: false, success: false },
      });
    case orderAction.names.CHARGE_ORDER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        chargeOrder: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case orderAction.names.CHARGE_ORDER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        chargeOrder: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case orderAction.names.CHARGE_ORDER + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        chargeOrder: { isLoading: false, data: {}, error: false, success: false },
      });
    case orderAction.names.CONFIRM_RECEIVED_ORDER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        confirmReceivedOrder: { isLoading: true, data: {}, error: false, success: false },
      });
    case orderAction.names.CONFIRM_RECEIVED_ORDER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        confirmReceivedOrder: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case orderAction.names.CONFIRM_RECEIVED_ORDER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        confirmReceivedOrder: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case orderAction.names.REMIND_SHIPMENT + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        remindShipment: { isLoading: true, data: {}, error: false, success: false },
      });
    case orderAction.names.REMIND_SHIPMENT + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        remindShipment: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case orderAction.names.REMIND_SHIPMENT + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        remindShipment: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case orderAction.names.REMIND_SHIPMENT + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        remindShipment: { isLoading: false, data: action.payload, error: false, success: false },
      });
    default:
      return state;
  }

};
