import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'FETCH_INVITED';

export const fetchInvited = (type) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(
        constants.baseEndpointV1 + 'pmt/xlmm/get_referal_mama', { params: { last_renew_type: type } }
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
