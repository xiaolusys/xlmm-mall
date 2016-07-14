import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'FETCH_MAMA_CHARGE';

export const fetchMamaCharge = (params) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}pmt/xlmm/mama_register_pay`, qs.stringify({
        ...params,
      }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
