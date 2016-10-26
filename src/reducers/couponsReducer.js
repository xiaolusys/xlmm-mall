import * as couponsAction from 'actions/user/coupons';
import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import { couponStatus } from 'constants';

const initState = {
  available: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  used: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  unavailable: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  expired: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  negotiable: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
};

const success = (state, action) => {
  switch (action.type) {
    case couponsAction.names.FETCH_COUPONS_BY_STATUS + '_' + actionTypes.SUCCESS:
      switch (action.payload.status) {
        case couponStatus.available:
          return _.extend({}, state, { available: { isLoading: false, error: false, success: true, data: action.payload } });
        case couponStatus.used:
          return _.extend({}, state, { used: { isLoading: false, error: false, success: true, data: action.payload } });
        case couponStatus.unavailable:
          return _.extend({}, state, { unavailable: { isLoading: false, error: false, success: true, data: action.payload } });
        case couponStatus.expired:
          return _.extend({}, state, { expired: { isLoading: false, error: false, success: true, data: action.payload } });
        default:
          return state;
      }
      break;
    case couponsAction.names.FETCH_NEGOTIABLE_COUPONS + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { negotiable: { isLoading: false, error: false, success: true, data: action.payload } });
    default:
      return state;
  }
};


export default (state = initState, action = null) => {
  switch (action.type) {
    case couponsAction.names.FETCH_COUPONS_BY_STATUS + '_' + actionTypes.REQUEST:
      return _.extend({}, state);
    case couponsAction.names.FETCH_COUPONS_BY_STATUS + '_' + actionTypes.SUCCESS:
      return success(state, action);
    case couponsAction.names.FETCH_COUPONS_BY_STATUS + '_' + actionTypes.FAILURE:
      return _.extend({}, state);
    case couponsAction.names.FETCH_NEGOTIABLE_COUPONS + '_' + actionTypes.REQUEST:
      return _.extend({}, state);
    case couponsAction.names.FETCH_NEGOTIABLE_COUPONS + '_' + actionTypes.SUCCESS:
      return success(state, action);
    case couponsAction.names.FETCH_NEGOTIABLE_COUPONS + '_' + actionTypes.FAILURE:
      return _.extend({}, state);
    default:
      return state;
  }
};
