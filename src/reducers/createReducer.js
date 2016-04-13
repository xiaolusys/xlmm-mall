import * as actionTypes from 'actions/actionTypes';

const initState = {
  isLoading: false,
  data: [],
  error: false,
};

const createReducer = function(name) {
  return (state = initState, action = null) => {
    switch (action.type) {
      case actionTypes.REQUEST + '_' + name:
        return Object.assign({}, state, { isLoading: true, error: false });
      case actionTypes.SUCCESS + '_' + name:
        return Object.assign({}, state, { isLoading: false, data: action.payload, error: false });
      case actionTypes.FAILURE + '_' + name:
        return Object.assign({}, state, { isLoading: false, data: action.payload, error: true });
      default:
        return state;
    }
  };
};

export default createReducer;
