import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = { FETCH_COMMISSION_LIST: 'FETCH_COMMISSION_LIST' };

const action = createAction(names.FETCH_COMMISSION_LIST);

export const fetchMamaCommissionList = (pageIndex, sortField, cid, reverse) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}modelproducts/product_choice`, { params: { page: pageIndex, sort_field: sortField, cid: cid, reverse: reverse } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetMamaCommissionList = () => {
  return (dispatch) => {
    dispatch(action.reset());
  };
};
