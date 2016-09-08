import * as productAction from 'actions/home/product';
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
    case productAction.name + '_' + actionTypes.REQUEST:
      payload = action.payload;
      if (state.data.when !== payload.when) {
        return _.extend({}, { isLoading: true, data: {}, error: false, success: false });
      }
      return _.extend({}, state, { isLoading: true, error: false, success: false });
    case productAction.name + '_' + actionTypes.SUCCESS:
      payload = action.payload;
      if (state.data.when === payload.when) {
        payload.results = _.chain(state.data.results || []).union(payload.results || []).unique('id').value();
      }
      return _.extend({}, state, { isLoading: false, data: payload, error: false, success: true });
    case productAction.name + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { isLoading: false, data: action.payload || {}, error: true, success: false });
    case productAction.name + '_' + actionTypes.RESET:
      return _.extend({}, state, { isLoading: false, data: {}, error: false, success: false });
    default:
      return state;
  }

};
