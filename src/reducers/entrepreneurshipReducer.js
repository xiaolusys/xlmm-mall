import * as entrepreneurshipAction from 'actions/activity/entrepreneurship';
import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import { couponStatus } from 'constants';

const initState = {
  mamaInfo: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  mamaRank: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  teamRank: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case entrepreneurshipAction.names.FETCH_MAMA_INFO + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaInfo: { isLoading: true, data: {}, error: false, success: false },
      });
    case entrepreneurshipAction.names.FETCH_MAMA_INFO + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaInfo: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case entrepreneurshipAction.names.FETCH_MAMA_INFO + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaInfo: { isLoading: false, data: action.payload, error: true, success: false },
      });

    case entrepreneurshipAction.names.FETCH_MAMA_RANK + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaRank: { isLoading: true, data: {}, error: false, success: false },
      });
    case entrepreneurshipAction.names.FETCH_MAMA_RANK + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaRank: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case entrepreneurshipAction.names.FETCH_MAMA_RANK + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaRank: { isLoading: false, data: action.payload, error: true, success: false },
      });

    case entrepreneurshipAction.names.FETCH_TEAM_RANK + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        teamRank: { isLoading: true, data: {}, error: false, success: false },
      });
    case entrepreneurshipAction.names.FETCH_TEAM_RANK + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        teamRank: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case entrepreneurshipAction.names.FETCH_TEAM_RANK + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        teamRank: { isLoading: false, data: action.payload, error: true, success: false },
      });
    default:
      return state;
  }
};
