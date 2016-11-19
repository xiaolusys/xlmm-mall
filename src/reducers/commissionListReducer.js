import * as commissionAction from 'actions/mama/commissionList';
import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';

const initState = {
  isLoading: false,
  error: false,
  success: false,
  data: {},
};

export default (state = initState, action = null) => {
  let payload = {};
  switch (action.type) {
    case commissionAction.names.FETCH_COMMISSION_LIST + '_' + actionTypes.REQUEST:
      payload = action.payload;
      return _.extend({}, state, { isLoading: true, error: false, success: false });
    case commissionAction.names.FETCH_COMMISSION_LIST + '_' + actionTypes.SUCCESS:
      payload = action.payload;
      payload.results = _.chain(state.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, { isLoading: false, data: payload, error: false, success: true });
    case commissionAction.names.FETCH_COMMISSION_LIST + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { isLoading: false, data: action.payload || {}, error: true, success: false });
    case commissionAction.names.FETCH_COMMISSION_LIST + '_' + actionTypes.RESET:
      return _.extend({}, state, { isLoading: false, data: {}, error: false, success: false });
    default:
      return state;
  }

};
