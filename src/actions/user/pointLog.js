import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const names = { FETCH_POINT_LOGS: 'FETCH_POINT_LOGS' };

export const fetchPointLogs = (pageIndex, pageSize) => {
  const action = createAction(names.FETCH_POINT_LOGS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'integrallog', { params: { page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
