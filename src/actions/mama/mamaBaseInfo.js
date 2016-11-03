import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  FETCH_MAMA_FORTUNE: 'FETCH_MAMA_FORTUNE',
  FETCH_MAMA_WEBVIEW_CONFIG: 'FETCH_MAMA_WEBVIEW_CONFIG',
};

export const fetchMamaFortune = () => {
  const action = createAction(names.FETCH_MAMA_FORTUNE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/fortune`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMamaWebCfg = () => {
  const action = createAction(names.FETCH_MAMA_WEBVIEW_CONFIG);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}mmwebviewconfig?version=1.0`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
