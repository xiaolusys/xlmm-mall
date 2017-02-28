import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';
import urlUtils from 'utils/url';

export const name = 'FETCH_NINE_PIC';

const action = createAction(name);

export const fetchNinePic = (params) => {
  const queryString = urlUtils.parseParam2URIString(params || {});
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}pmt/ninepic?${queryString}`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
