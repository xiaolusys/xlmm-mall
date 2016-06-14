import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';

export const name = 'COMPLAINT_HOSTORY';

export const fetchComplaints = (pageIndex, pageSize) => {
  const params = { params: { page: pageIndex, page_size: pageSize } };
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'complain/history_complains', params)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
