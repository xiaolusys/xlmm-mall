import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'FETCH_MAMA_INFO';

const action = createAction(name);

export const fetchMamaInfo = () => {
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
