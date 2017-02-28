import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';
import { parseParam2URIString } from 'utils/url';

export const name = 'FETCH_NINE_PIC';

const action = createAction(name);

export const fetchNinePic = (params) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}pmt/ninepic?{parseParam2URIString(params)}`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
