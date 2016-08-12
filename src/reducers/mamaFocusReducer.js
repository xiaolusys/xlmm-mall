import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as mamafocusAction from 'actions/mama/focus';

const initState = {
  isLoading: false,
  error: false,
  success: false,
  data: {},
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case mamafocusAction.names.FOCUS_MAMA + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        isLoading: true,
        data: state.data,
        error: false,
        success: false,
      });
    case mamafocusAction.names.FOCUS_MAMA + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        isLoading: false,
        data: payload,
        error: false,
        success: true,
      });
    case mamafocusAction.names.FOCUS_MAMA + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        isLoading: false,
        data: action.payload,
        error: true,
        success: false,
        status: action.status,
      });
    case mamafocusAction.names.FOCUS_MAMA + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        isLoading: false,
        data: {},
        error: false,
        success: false,
      });

    default:
      return state;
  }

};
