import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const coinNames = { FETCH_XIAOLU_COIN_LOGS: 'FETCH_XIAOLU_COIN_LOGS' };

export const fetchXiaoluCoinLogs = (pageIndex, pageSize) => {
  const action = createAction(coinNames.FETCH_XIAOLU_COIN_LOGS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'xiaolucoin/history', { params: { page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
