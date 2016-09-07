import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';

export const names = {
  FETCH_SPELL_GROUP_PROGRESS: 'FETCH_SPELL_GROUP_PROGRESS',
  FETCH_SPELL_GROUP_SHARE_INFO: 'FETCH_SPELL_GROUP_SHARE_INFO',
};

const detailAction = createAction(names.FETCH_SPELL_GROUP_PROGRESS);
const shareAction = createAction(names.FETCH_SPELL_GROUP_SHARE_INFO);
let count = 0;

export const fetchSpellGroupShareInfo = (spellGroupId) => {
  return (dispatch) => {
    dispatch(shareAction.request());
    return axios.get(`${constants.baseEndpoint}teambuy/${spellGroupId}/get_share_params`)
      .then((resp) => {
        dispatch(shareAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(shareAction.failure(resp.data));
      });
  };
};

export const fetchSpellGroupDetails = (tid) => {
  return (dispatch) => {
    dispatch(detailAction.request());
    return axios.get(`${constants.baseEndpoint}teambuy/${tid}/team_info`)
      .then((resp) => {
        dispatch(detailAction.success(resp.data));
        if (resp && resp.data && resp.data.id) {
          dispatch(fetchSpellGroupShareInfo(resp.data.id));
          return;
        }
        _.delay(function() {
          dispatch(fetchSpellGroupDetails(tid));
        }, 2000);
      })
      .catch((resp) => {
        dispatch(detailAction.failure(resp.data));
        if (count < 3) {
          _.delay(function() {
            dispatch(fetchSpellGroupDetails(tid));
          }, 2000);
          count++;
        }
      });
  };
};
