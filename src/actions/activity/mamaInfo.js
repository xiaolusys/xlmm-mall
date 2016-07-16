import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  FETCH_MAMA_INFO: 'FETCH_MAMA_INFO',
  SAVE_MAMA_INFO: 'SAVE_MAMA_INFO',
};

export const fetchMamaInfo = () => {
  const action = createAction(names.FETCH_MAMA_INFO);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}pmt/xlmm/fill_mama_info`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const saveMamaInfo = (params) => {
  const action = createAction(names.SAVE_MAMA_INFO);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(`${constants.baseEndpointV1}pmt/xlmm/fill_mama_info`, qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
