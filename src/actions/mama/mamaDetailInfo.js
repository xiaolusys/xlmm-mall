import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const actionNames = {
  FETCH_MAMA_FORTUNE: 'FETCH_MAMA_FORTUNE',
  FETCH_MAMA_WEBVIEW_CONFIG: 'FETCH_MAMA_WEBVIEW_CONFIG',
  FETCH_MAMA_LEADER: 'FETCH_MAMA_LEADER',
  FETCH_TEAM_MEMBER: 'FETCH_TEAM_MEMBER',
  FETCH_ELITE_SCORE_LOG: 'FETCH_ELITE_SCORE_LOG',
};

export const fetchMamaFortune = () => {
  const action = createAction(actionNames.FETCH_MAMA_FORTUNE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/fortune`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMamaWebCfg = () => {
  const action = createAction(actionNames.FETCH_MAMA_WEBVIEW_CONFIG);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}mmwebviewconfig?version=1.0`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMamaLeader = () => {
  const action = createAction(actionNames.FETCH_MAMA_LEADER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}pmt/xlmm/get_my_leader_mama_baseinfo`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMamaTeamMember = () => {
  const action = createAction(actionNames.FETCH_TEAM_MEMBER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}pmt/xlmm/get_elite_team_members`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMamaEliteScoreLog = (pageIndex, pageSize) => {
  const action = createAction(actionNames.FETCH_ELITE_SCORE_LOG);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/elite_score`, { params: { page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
