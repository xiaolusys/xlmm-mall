import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const names = {
  FETCH_SPELL_GROUP_PROGRESS: 'FETCH_SPELL_GROUP_PROGRESS',
};

export const fetchSpellGroupDetails = (tid) => {
  const action = createAction(names.FETCH_SPELL_GROUP_PROGRESS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}teambuy/${tid}/team_info`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
