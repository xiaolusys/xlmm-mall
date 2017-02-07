import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as rebateAction from 'actions/mama/rebate';

const initState = {
  topRebate: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  myRebate: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case rebateAction.rebateNames.FETCH_TOP_MAMA_REBATE + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        topRebate: { isLoading: true, data: state.topRebate.data, error: false, success: false },
      });
    case rebateAction.rebateNames.FETCH_TOP_MAMA_REBATE + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.topRebate.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        topRebate: { isLoading: false, data: payload, error: false, success: true },
      });
    case rebateAction.rebateNames.FETCH_TOP_MAMA_REBATE + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        topRebate: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case rebateAction.rebateNames.FETCH_TOP_MAMA_REBATE + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        topRebate: { isLoading: false, data: {}, error: false, success: false },
      });

    case rebateAction.rebateNames.FETCH_MAMA_REBATE + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        myRebate: { isLoading: true, data: state.myRebate.data, error: false, success: false },
      });
    case rebateAction.rebateNames.FETCH_MAMA_REBATE + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        myRebate: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case rebateAction.rebateNames.FETCH_MAMA_REBATE + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        myRebate: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case rebateAction.rebateNames.FETCH_MAMA_REBATE + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        myRebate: { isLoading: false, data: {}, error: false, success: false },
      });

    default:
      return state;
  }

};
