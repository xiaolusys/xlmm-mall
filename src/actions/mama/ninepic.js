import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'FETCH_NINE_PIC';

const action = createAction(name);

export const fetchNinePic = (ordering, category) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpointV1}pmt/ninepic?` + ((ordering && ordering.length > 0) ? 'ordering=' + ordering : '')
                    + ((category && category.length > 0) ? 'sale_category=' + category : ''))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
