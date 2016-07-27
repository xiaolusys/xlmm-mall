import * as constants from 'constants';
import axios from 'axios';
import createAction from 'actions/createAction';
import qs from 'qs';

export const name = 'FETCH_ACTIVITY_RANK';

export const fetchActivityRank = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get('/m/rank/2/activity_get_team_members')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
