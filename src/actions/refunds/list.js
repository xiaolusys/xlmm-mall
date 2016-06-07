import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const names = { FETCH_REFUNDS: 'FETCH_REFUNDS' };
const fetchRefundsAction = createAction(names.FETCH_REFUNDS);

export const fetchRefunds = (pageIndex, pageSize) => {
  const params = { params: { page: pageIndex, page_size: pageSize } };
  return (dispatch) => {
    dispatch(fetchRefundsAction.request());
    return axios.get(constants.baseEndpointV1 + 'refunds', params)
      .then((resp) => {
        dispatch(fetchRefundsAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(fetchRefundsAction.failure(resp));
      });
  };
};
