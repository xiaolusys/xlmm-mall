import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as cashoutAction from 'actions/user/userCashout';

const initState = {
  cashoutList: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  cashout: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  cashoutPolicy: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  cashoutVerifyCode: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case cashoutAction.names.FETCH_CASHOUT_LIST + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        cashoutList: { isLoading: true, data: state.cashoutList.data, error: false, success: false },
      });
    case cashoutAction.names.FETCH_CASHOUT_LIST + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      // payload.results = _.chain(state.cashoutList.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        cashoutList: { isLoading: false, data: payload, error: false, success: true },
      });
    case cashoutAction.names.FETCH_CASHOUT_LIST + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        cashoutList: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case cashoutAction.names.FETCH_CASHOUT_LIST + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        cashoutList: { isLoading: false, data: {}, error: false, success: false },
      });

    case cashoutAction.names.CASHOUT + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        cashout: { isLoading: true, data: state.cashout.data, error: false, success: false },
      });
    case cashoutAction.names.CASHOUT + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        cashout: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case cashoutAction.names.CASHOUT + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        cashout: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case cashoutAction.names.CASHOUT + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        cashout: { isLoading: false, data: {}, error: false, success: false },
      });

    case cashoutAction.names.FETCH_CASHOUT_POLICY + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        cashoutPolicy: { isLoading: true, data: state.cashoutPolicy.data, error: false, success: false },
      });
    case cashoutAction.names.FETCH_CASHOUT_POLICY + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        cashoutPolicy: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case cashoutAction.names.FETCH_CASHOUT_POLICY + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        cashoutPolicy: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case cashoutAction.names.FETCH_CASHOUT_POLICY + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        cashoutPolicy: { isLoading: false, data: {}, error: false, success: false },
      });

    case cashoutAction.names.REQUEST_CASHOUT_VERIFY_CODE + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        cashoutVerifyCode: { isLoading: true, data: state.cashoutVerifyCode.data, error: false, success: false },
      });
    case cashoutAction.names.REQUEST_CASHOUT_VERIFY_CODE + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        cashoutVerifyCode: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case cashoutAction.names.REQUEST_CASHOUT_VERIFY_CODE + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        cashoutVerifyCode: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case cashoutAction.names.REQUEST_CASHOUT_VERIFY_CODE + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        cashoutVerifyCode: { isLoading: false, data: {}, error: false, success: false },
      });

    default:
      return state;
  }

};
