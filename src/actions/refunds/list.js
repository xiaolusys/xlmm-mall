import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'FETCH_REFUNDS_LIST';

export const fetchRefunds = (pageIndex, pageSize) => {
  const action = createAction(name);
  const params = { params: { page: pageIndex } };
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'refunds')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
