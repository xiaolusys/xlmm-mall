import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as refundsAction from 'actions/refunds/list';

const initState = {
  isLoading: false,
  error: false,
  success: false,
  data: {},
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case refundsAction.names.FETCH_REFUNDS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { isLoading: true, data: state.data, error: false, success: false });
    case refundsAction.names.FETCH_REFUNDS + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, { isLoading: false, data: payload, error: false, success: true });
    case refundsAction.names.FETCH_REFUNDS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { isLoading: false, data: action.payload, error: true, success: false });
    case refundsAction.names.FETCH_REFUNDS + '_' + actionTypes.RESET:
      return _.extend({}, state, { isLoading: false, data: action.payload, error: false, success: false });
    default:
      return state;
  }

};
