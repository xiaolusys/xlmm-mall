import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as mamaInfoAction from 'actions/mama/mamaInfo';

const initState = {
  mamaInfo: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  saveInfo: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case mamaInfoAction.mamaInfoNames.FETCH_MAMA_INFO + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaInfo: { isLoading: true, data: state.mamaInfo.data, error: false, success: false },
      });
    case mamaInfoAction.mamaInfoNames.FETCH_MAMA_INFO + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaInfo: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaInfoAction.mamaInfoNames.FETCH_MAMA_INFO + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaInfo: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case mamaInfoAction.mamaInfoNames.FETCH_MAMA_INFO + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        mamaInfo: { isLoading: false, data: {}, error: false, success: false },
      });

    case mamaInfoAction.mamaInfoNames.FETCH_MAMA_INFO_BY_ID + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaInfo: { isLoading: true, data: state.mamaInfo.data, error: false, success: false },
      });
    case mamaInfoAction.mamaInfoNames.FETCH_MAMA_INFO_BY_ID + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaInfo: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaInfoAction.mamaInfoNames.FETCH_MAMA_INFO_BY_ID + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaInfo: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case mamaInfoAction.mamaInfoNames.FETCH_MAMA_INFO_BY_ID + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        mamaInfo: { isLoading: false, data: {}, error: false, success: false },
      });

      case mamaInfoAction.mamaInfoNames.SAVE_MAMA_INFO + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        saveInfo: { isLoading: true, data: state.saveInfo.data, error: false, success: false },
      });
    case mamaInfoAction.mamaInfoNames.SAVE_MAMA_INFO + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        saveInfo: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case mamaInfoAction.mamaInfoNames.SAVE_MAMA_INFO + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        saveInfo: { isLoading: false, data: action.payload, error: true, success: false },
      });

    default:
      return state;
  }

};
