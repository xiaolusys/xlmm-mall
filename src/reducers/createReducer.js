import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';

const initState = {
  isLoading: false,
  error: false,
  success: false,
  data: {},
};

const createReducer = function(name, successReducer) {
  return (state = initState, action = null) => {
    switch (action.type) {
      case name + '_' + actionTypes.REQUEST:
        return _.extend({}, state, { isLoading: true, error: false, success: false }); // Object.assign is not supported by too many browser. http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign
      case name + '_' + actionTypes.SUCCESS:
        if (successReducer) {
          return successReducer(state, action.payload);
        }
        return _.extend({}, state, { isLoading: false, data: action.payload, error: false, success: true });
      case name + '_' + actionTypes.FAILURE:
        return _.extend({}, state, { isLoading: false, data: action.payload, error: true, success: false });
      case name + '_' + actionTypes.RESET:
        return _.extend({}, state, { isLoading: false, data: {}, error: false, success: false });
      default:
        return state;
    }
  };
};

export default createReducer;
