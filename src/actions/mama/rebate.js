import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const rebateNames = {
  FETCH_TOP_MAMA_REBATE: 'FETCH_TOP_MAMA_REBATE',
  FETCH_MAMA_REBATE: 'FETCH_MAMA_REBATE',
};

export const fetchTopMamaRebate = () => {
  const action = createAction(rebateNames.FETCH_TOP_MAMA_REBATE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(
        constants.baseEndpoint + 'rebate'
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMamaRebate = () => {
  const action = createAction(rebateNames.FETCH_MAMA_REBATE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(
        constants.baseEndpoint + 'rebate/history'
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
