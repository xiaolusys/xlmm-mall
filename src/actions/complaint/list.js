import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';

export const names = { COMPLAINT_HOSTORY: 'COMPLAINT_HOSTORY' };
const fetchComplaintsAction = createAction(names.COMPLAINT_HOSTORY);

export const fetchComplaints = (pageIndex, pageSize) => {
  const params = { params: { page: pageIndex, page_size: pageSize } };
  return (dispatch) => {
    dispatch(fetchComplaintsAction.request());
    return axios.get(constants.baseEndpointV1 + 'complain/history_complains', params)
      .then((resp) => {
        dispatch(fetchComplaintsAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(fetchComplaintsAction.failure(resp));
      });
  };
};
