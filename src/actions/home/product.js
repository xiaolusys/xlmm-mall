import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'PRODUCT';

export const fetchProduct = (when, pageIndex, pageSize) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'products/' + when, { params: { page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
