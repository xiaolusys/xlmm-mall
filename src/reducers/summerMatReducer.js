import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as summerMatAction from 'actions/activity/summerMat';

const initState = {
  signUp: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  fetchMumInfo: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  fetchRegisters: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  register: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case summerMatAction.names.SIGN_UP + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        signUp: { isLoading: true, data: {}, error: false, success: false },
      });
    case summerMatAction.names.SIGN_UP + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        signUp: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case summerMatAction.names.SIGN_UP + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        signUp: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case summerMatAction.names.FETCH_MUM_INFO + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        fetchMumInfo: { isLoading: true, data: {}, error: false, success: false },
      });
    case summerMatAction.names.FETCH_MUM_INFO + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        fetchMumInfo: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case summerMatAction.names.FETCH_MUM_INFO + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        fetchMumInfo: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case summerMatAction.names.FETCH_REGISTERS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        fetchRegisters: { isLoading: true, data: state.fetchRegisters.data || {}, error: false, success: false },
      });
    case summerMatAction.names.FETCH_REGISTERS + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.fetchRegisters.data && state.fetchRegisters.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        fetchRegisters: { isLoading: false, data: payload, error: false, success: true },
      });
    case summerMatAction.names.FETCH_REGISTERS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        fetchRegisters: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case summerMatAction.names.REGISTER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        register: { isLoading: true, data: {}, error: false, success: false },
      });
    case summerMatAction.names.REGISTER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        register: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case summerMatAction.names.REGISTER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        register: { isLoading: false, data: action.payload, error: true, success: false },
      });
    default:
      return state;
  }

};
