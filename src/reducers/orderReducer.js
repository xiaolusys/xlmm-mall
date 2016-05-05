import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as orderAction from 'actions/order/order';

const initState = {
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
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case orderAction.names.FETCH_ORDER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        fetchOrder: { isLoading: true, data: {}, error: false, success: false },
      });
    case orderAction.names.FETCH_ORDER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        fetchOrder: { isLoading: false, data: action.payload, error: false, success: true },
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
    default:
      return state;
  }

};
