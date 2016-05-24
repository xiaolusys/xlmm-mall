import * as verifyCodeAction from 'actions/user/verifyCode';
import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';

const initState = {
  fetch: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  verify: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case verifyCodeAction.names.FETCH_VERIFY_CODE + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { fetch: { isLoading: true, success: false, error: false } });
    case verifyCodeAction.names.FETCH_VERIFY_CODE + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { fetch: { isLoading: false, data: action.payload, success: true, error: false } });
    case verifyCodeAction.names.FETCH_VERIFY_CODE + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { fetch: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    case verifyCodeAction.names.VERIFY + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { verify: { isLoading: true, success: false, error: false } });
    case verifyCodeAction.names.VERIFY + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { verify: { isLoading: false, data: action.payload, success: true, error: false } });
    case verifyCodeAction.names.VERIFY + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { verify: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    default:
      return state;
  }

};
