import axios from 'axios';
import createAction from '../createAction';
import * as constants from 'constants';
import qs from 'qs';

export const name = 'PUSH_EXPRESS_INFO';

export const pushExpressInfo = (params) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'refunds', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
