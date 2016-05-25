import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const name = 'COMMIT_ORDER';

export const commitOrder = (params) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + '/carts/carts_payinfo', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
