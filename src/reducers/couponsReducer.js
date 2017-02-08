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
  applynegotiable: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  unusedBoutique: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  freezedBoutique: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  applyReturn: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
};

const success = (state, action) => {
  let payload = {};
  switch (action.type) {
    case couponsAction.couponsNames.FETCH_COUPONS_BY_STATUS + '_' + actionTypes.SUCCESS:
      switch (action.payload.status) {
        case couponStatus.available:
          payload = action.payload;
          payload.results = _.chain(state.available.data.results || []).union(payload.results || []).unique('id').value();
          return _.extend({}, state, {
            available: { isLoading: false, data: payload, error: false, success: true },
          });
        case couponStatus.used:
          payload = action.payload;
          payload.results = _.chain(state.used.data.results || []).union(payload.results || []).unique('id').value();
          return _.extend({}, state, {
            used: { isLoading: false, data: payload, error: false, success: true },
          });
        case couponStatus.unavailable:
          payload = action.payload;
          payload.results = _.chain(state.unavailable.data.results || []).union(payload.results || []).unique('id').value();
          return _.extend({}, state, {
            unavailable: { isLoading: false, data: payload, error: false, success: true },
          });
        case couponStatus.expired:
          payload = action.payload;
          payload.results = _.chain(state.expired.data.results || []).union(payload.results || []).unique('id').value();
          return _.extend({}, state, {
            expired: { isLoading: false, data: payload, error: false, success: true },
          });
        default:
          return state;
      }
      break;
    case couponsAction.couponsNames.FETCH_NEGOTIABLE_COUPONS + '_' + actionTypes.SUCCESS:
      payload = action.payload;
      payload.results = _.chain(state.negotiable.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        negotiable: { isLoading: false, data: payload, error: false, success: true },
      });
    case couponsAction.couponsNames.APPLY_NEGOTIABLE_COUPONS + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { applynegotiable: { isLoading: false, error: false, success: true, data: action.payload } });
    default:
      return state;
  }
};


export default (state = initState, action = null) => {
  switch (action.type) {
    case couponsAction.couponsNames.FETCH_COUPONS_BY_STATUS + '_' + actionTypes.REQUEST:
      return _.extend({}, state);
    case couponsAction.couponsNames.FETCH_COUPONS_BY_STATUS + '_' + actionTypes.SUCCESS:
      return success(state, action);
    case couponsAction.couponsNames.FETCH_COUPONS_BY_STATUS + '_' + actionTypes.FAILURE:
      return _.extend({}, state);
    case couponsAction.couponsNames.FETCH_NEGOTIABLE_COUPONS + '_' + actionTypes.REQUEST:
      return _.extend({}, state);
    case couponsAction.couponsNames.FETCH_NEGOTIABLE_COUPONS + '_' + actionTypes.SUCCESS:
      return success(state, action);
    case couponsAction.couponsNames.FETCH_NEGOTIABLE_COUPONS + '_' + actionTypes.FAILURE:
      return _.extend({}, state);

    case couponsAction.couponsNames.APPLY_NEGOTIABLE_COUPONS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        applynegotiable: { isLoading: true, data: state.applynegotiable.data, error: false, success: false },
      });
    case couponsAction.couponsNames.APPLY_NEGOTIABLE_COUPONS + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        applynegotiable: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case couponsAction.couponsNames.APPLY_NEGOTIABLE_COUPONS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        applynegotiable: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case couponsAction.couponsNames.APPLY_NEGOTIABLE_COUPONS + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        applynegotiable: { isLoading: false, data: {}, error: false, success: false },
      });

    case couponsAction.couponsNames.FETCH_UNUSED_BOTIQUE_COUPONS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        unusedBoutique: { isLoading: true, data: state.unusedBoutique.data, error: false, success: false },
      });
    case couponsAction.couponsNames.FETCH_UNUSED_BOTIQUE_COUPONS + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        unusedBoutique: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case couponsAction.couponsNames.FETCH_UNUSED_BOTIQUE_COUPONS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        unusedBoutique: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case couponsAction.couponsNames.FETCH_UNUSED_BOTIQUE_COUPONS + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        unusedBoutique: { isLoading: false, data: {}, error: false, success: false },
      });

    case couponsAction.couponsNames.FETCH_FREEZED_BOTIQUE_COUPONS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        freezedBoutique: { isLoading: true, data: state.freezedBoutique.data, error: false, success: false },
      });
    case couponsAction.couponsNames.FETCH_FREEZED_BOTIQUE_COUPONS + '_' + actionTypes.SUCCESS:
      let payload = {};
      payload = action.payload;
      payload.results = _.chain(state.freezedBoutique.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        freezedBoutique: { isLoading: false, data: payload, error: false, success: true },
      });
    case couponsAction.couponsNames.FETCH_FREEZED_BOTIQUE_COUPONS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        freezedBoutique: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case couponsAction.couponsNames.FETCH_FREEZED_BOTIQUE_COUPONS + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        freezedBoutique: { isLoading: false, data: {}, error: false, success: false },
      });

      case couponsAction.couponsNames.APPLY_RETURN_COUPONS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        applyReturn: { isLoading: true, data: state.applyReturn.data, error: false, success: false },
      });
    case couponsAction.couponsNames.APPLY_RETURN_COUPONS + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        applyReturn: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case couponsAction.couponsNames.APPLY_RETURN_COUPONS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        applyReturn: { isLoading: false, data: action.payload, error: true, success: false },
      });

    default:
      return state;
  }
};
