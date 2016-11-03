import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as mamaBaseInfoAction from 'actions/mama/mamaBaseInfo';

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
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case mamaBaseInfoAction.names.FETCH_MAMA_FORTUNE + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaFortune: { isLoading: true, data: state.mamaFortune.data, error: false, success: false },
      });
    case mamaBaseInfoAction.names.FETCH_MAMA_FORTUNE + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaFortune: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaBaseInfoAction.names.FETCH_MAMA_FORTUNE + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaFortune: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case mamaBaseInfoAction.names.FETCH_MAMA_FORTUNE + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        mamaFortune: { isLoading: false, data: {}, error: false, success: false },
      });

    case mamaBaseInfoAction.names.FETCH_MAMA_WEBVIEW_CONFIG + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaWebCfg: { isLoading: true, data: state.mamaWebCfg.data, error: false, success: false },
      });
    case mamaBaseInfoAction.names.FETCH_MAMA_WEBVIEW_CONFIG + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaWebCfg: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaBaseInfoAction.names.FETCH_MAMA_WEBVIEW_CONFIG + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaWebCfg: { isLoading: false, data: action.payload, error: true, success: false },
      });
    default:
      return state;
  }

};
