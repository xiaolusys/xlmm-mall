import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as spellGroupAction from 'actions/order/spellGroup';

const initState = {
  progress: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  share: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case spellGroupAction.names.FETCH_SPELL_GROUP_PROGRESS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        progress: { isLoading: true, data: state.progress.data, error: false, success: false },
      });
    case spellGroupAction.names.FETCH_SPELL_GROUP_PROGRESS + '_' + actionTypes.SUCCESS:
      const payload = action.payload;
      const details = [];
      for (let i = 0; i < (3 - payload.detail_info.length); i++) {
        details.push({ customer_thumbnail: 'http://7xogkj.com1.z0.glb.clouddn.com/mall/order/spell/group/unPresent.png' });
      }
      payload.detail_info = _.union(payload.detail_info, details);
      return _.extend({}, state, {
        progress: { isLoading: false, data: payload, error: false, success: true },
      });
    case spellGroupAction.names.FETCH_SPELL_GROUP_PROGRESS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        progress: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case spellGroupAction.names.FETCH_SPELL_GROUP_PROGRESS + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        progress: { isLoading: false, data: {}, error: false, success: false },
      });

    case spellGroupAction.names.FETCH_SPELL_GROUP_SHARE_INFO + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        share: { isLoading: true, data: state.share.data, error: false, success: false },
      });
    case spellGroupAction.names.FETCH_SPELL_GROUP_SHARE_INFO + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        share: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case spellGroupAction.names.FETCH_SPELL_GROUP_SHARE_INFO + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        share: { isLoading: false, data: action.payload, error: true, success: false },
      });
    default:
      return state;
  }

};
