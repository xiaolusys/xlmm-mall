import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  FETCH_MAMA_INFO: 'FETCH_MAMA_INFO',
  FETCH_MAMA_RANK: 'FETCH_MAMA_RANK',
  FETCH_TEAM_RANK: 'FETCH_TEAM_RANK',
  FETCH_INVITE_AWARD: 'FETCH_INVITE_AWARD',
  FETCH_INCOME_AWARD: 'FETCH_INCOME_AWARD',
  FETCH_TEAM_AWARD: 'FETCH_TEAM_AWARD',
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
    return axios.get(constants.baseEndpoint + 'mama/rank/activity_carry_total_rank')
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
    return axios.get(constants.baseEndpoint + 'mama/teamrank/activity_carry_total_rank')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchInviteAward = () => {
  const action = createAction(names.FETCH_INVITE_AWARD);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'mama/award/get_invite_award')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchIncomeAward = () => {
  const action = createAction(names.FETCH_INCOME_AWARD);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'mama/award/get_income_award')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchTeamAward = () => {
  const action = createAction(names.FETCH_TEAM_AWARD);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'mama/award/get_team_award')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
