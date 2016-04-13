import * as actionTypes from 'actions/actionTypes';

export function categories(state = {
  isLoading: false,
  data: [],
  error: false,
}, action = null) {
  switch (action.type) {
    case actionTypes.REQUEST:
      return Object.assign({}, state, { isLoading: true, error: false });
    case actionTypes.SUCCESS:
      return Object.assign({}, state, { isLoading: false, data: action.payload, error: false });
    case actionTypes.FAILURE:
      return Object.assign({}, state, { isLoading: false, data: action.payload, error: true });
    default:
      return state;
  }
}
