import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';

const initState = {
  isLoading: false,
  data: [],
  error: false,
};

const createReducer = function(name) {
  return (state = initState, action = null) => {
    switch (action.type) {
      case actionTypes.REQUEST + '_' + name:
        return _.extend({}, state, { isLoading: true, error: false }); // Object.assign has not been support too many browser. http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign
      case actionTypes.SUCCESS + '_' + name:
        return _.extend({}, state, { isLoading: false, data: action.payload, error: false });
      case actionTypes.FAILURE + '_' + name:
        return _.extend({}, state, { isLoading: false, data: action.payload, error: true });
      default:
        return state;
    }
  };
};

export default createReducer;
