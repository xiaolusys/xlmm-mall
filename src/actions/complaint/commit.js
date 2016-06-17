import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';

export const name = 'COMPLAINT_COMMIT';

export const commitComplaint = (content, type) => {
  const action = createAction(name);
  const params = { params: { com_content: content, com_type: type } };
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'complain', params)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
