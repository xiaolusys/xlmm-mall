import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  FETCH_MAMA_INFO: 'FETCH_MAMA_INFO',
  FETCH_MAMA_RANK: 'FETCH_MAMA_RANK',
  FETCH_TEAM_RANK: 'FETCH_TEAM_RANK',
};

export const fetchMamaInfo = () => {
  const action = createAction(names.FETCH_MAMA_INFO);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'mama/rank/activity_self_rank')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMamaRank = () => {
  const action = createAction(names.FETCH_MAMA_RANK);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'mama/teamrank/activity_carry_total_rank')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchTeamRank = () => {
  const action = createAction(names.FETCH_TEAM_RANK);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'mama/rank/activity_carry_total_rank')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
