import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as courseAction from 'actions/mama/course';

const initState = {
  fetchCourse: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  readCourse: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case courseAction.names.FETCH_COURSE + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        fetchCourse: { isLoading: true, data: state.fetchCourse.data, error: false, success: false },
      });
    case courseAction.names.FETCH_COURSE + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.fetchCourse.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        fetchCourse: { isLoading: false, data: payload, error: false, success: true },
      });
    case courseAction.names.FETCH_COURSE + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        fetchCourse: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case courseAction.names.FETCH_COURSE + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        fetchCourse: { isLoading: false, data: {}, error: false, success: false },
      });
    case courseAction.names.READ_COURSE + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        readCourse: { isLoading: true, data: state.readCourse.data, error: false, success: false },
      });
    case courseAction.names.READ_COURSE + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        readCourse: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case courseAction.names.READ_COURSE + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        readCourse: { isLoading: false, data: action.payload, error: true, success: false },
      });
    default:
      return state;
  }

};
