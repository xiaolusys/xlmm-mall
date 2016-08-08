import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as notificationAction from 'actions/mama/notification';

const initState = {
  fetchNotification: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  readNotification: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case notificationAction.names.FETCH_NOTIFICATIONS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        fetchNotification: { isLoading: true, data: state.fetchNotification.data, error: false, success: false },
      });
    case notificationAction.names.FETCH_NOTIFICATIONS + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.fetchNotification.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        fetchNotification: { isLoading: false, data: payload, error: false, success: true },
      });
    case notificationAction.names.FETCH_NOTIFICATIONS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        fetchNotification: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case notificationAction.names.FETCH_NOTIFICATIONS + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        fetchNotification: { isLoading: false, data: {}, error: false, success: false },
      });

    case notificationAction.names.READ_NOTIFICATION + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        readNotification: { isLoading: true, data: state.readNotification.data, error: false, success: false },
      });
    case notificationAction.names.READ_NOTIFICATION + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        readNotification: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case notificationAction.names.READ_NOTIFICATION + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        readNotification: { isLoading: false, data: action.payload, error: true, success: false },
      });

    default:
      return state;
  }

};
