import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as mamaDetailInfoAction from 'actions/mama/mamaDetailInfo';

const initState = {
  mamaFortune: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  mamaWebCfg: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  mamaLeader: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  mamaTeamMember: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  mamaEliteScoreLog: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case mamaDetailInfoAction.actionNames.FETCH_MAMA_FORTUNE + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaFortune: { isLoading: true, data: state.mamaFortune.data, error: false, success: false },
      });
    case mamaDetailInfoAction.actionNames.FETCH_MAMA_FORTUNE + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaFortune: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaDetailInfoAction.actionNames.FETCH_MAMA_FORTUNE + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaFortune: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case mamaDetailInfoAction.actionNames.FETCH_MAMA_FORTUNE + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        mamaFortune: { isLoading: false, data: {}, error: false, success: false },
      });

    case mamaDetailInfoAction.actionNames.FETCH_MAMA_WEBVIEW_CONFIG + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaWebCfg: { isLoading: true, data: state.mamaWebCfg.data, error: false, success: false },
      });
    case mamaDetailInfoAction.actionNames.FETCH_MAMA_WEBVIEW_CONFIG + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaWebCfg: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaDetailInfoAction.actionNames.FETCH_MAMA_WEBVIEW_CONFIG + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaWebCfg: { isLoading: false, data: action.payload, error: true, success: false },
      });

    case mamaDetailInfoAction.actionNames.FETCH_MAMA_LEADER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaLeader: { isLoading: true, data: state.mamaLeader.data, error: false, success: false },
      });
    case mamaDetailInfoAction.actionNames.FETCH_MAMA_LEADER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaLeader: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaDetailInfoAction.actionNames.FETCH_MAMA_LEADER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaLeader: { isLoading: false, data: action.payload, error: true, success: false },
      });

    case mamaDetailInfoAction.actionNames.FETCH_TEAM_MEMBER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaTeamMember: { isLoading: true, data: state.mamaTeamMember.data, error: false, success: false },
      });
    case mamaDetailInfoAction.actionNames.FETCH_TEAM_MEMBER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaTeamMember: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaDetailInfoAction.actionNames.FETCH_TEAM_MEMBER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaTeamMember: { isLoading: false, data: action.payload, error: true, success: false },
      });

    case mamaDetailInfoAction.actionNames.FETCH_ELITE_SCORE_LOG + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaEliteScoreLog: { isLoading: true, data: state.mamaEliteScoreLog.data, error: false, success: false },
      });
    case mamaDetailInfoAction.actionNames.FETCH_ELITE_SCORE_LOG + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      payload.results = _.chain(state.mamaEliteScoreLog.data.results || []).union(payload.results || []).unique().value();
      return _.extend({}, state, {
        mamaEliteScoreLog: { isLoading: false, data: payload, error: false, success: true },
      });
    case mamaDetailInfoAction.actionNames.FETCH_ELITE_SCORE_LOG + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaEliteScoreLog: { isLoading: false, data: action.payload, error: true, success: false },
      });
    default:
      return state;
  }

};
