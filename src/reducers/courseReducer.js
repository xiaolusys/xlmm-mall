import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as courseAction from 'actions/mama/course';

const initState = {
  isLoading: false,
  error: false,
  success: false,
  data: {},
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case courseAction.name + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { isLoading: true, data: state.data, error: false, success: false });
    case courseAction.name + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, { isLoading: false, data: payload, error: false, success: true });
    case courseAction.name + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { isLoading: false, data: action.payload, error: true, success: false });
    case courseAction.name + '_' + actionTypes.RESET:
      return _.extend({}, state, { isLoading: false, data: {}, error: false, success: false });
    default:
      return state;
  }

};
