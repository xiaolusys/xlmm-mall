import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';

const initState = {
  isLoading: false,
  error: false,
  success: false,
  data: {},
};

const createReducer = function(name) {
  return (state = initState, action = null) => {
    switch (action.type) {
      case actionTypes.REQUEST + '_' + name:
        return _.extend({}, state, { isLoading: true, error: false, success: false }); // Object.assign is not supported by too many browser. http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign
      case actionTypes.SUCCESS + '_' + name:
        return _.extend({}, state, { isLoading: false, data: action.payload, error: false, success: true });
      case actionTypes.FAILURE + '_' + name:
        return _.extend({}, state, { isLoading: false, data: action.payload, error: true, success: false });
      default:
        return state;
    }
  };
};

export default createReducer;
