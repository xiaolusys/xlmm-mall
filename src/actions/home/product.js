import * as constants from 'constants';
import axios from 'axios';
import _ from 'underscore';
import createAction from '../createAction';

export const productActionName = 'FETCH_PRODUCT';

export const fetchProduct = (when, pageIndex, pageSize, cid, orderBy) => {
  const action = createAction(productActionName);
  return (dispatch) => {
    dispatch(action.request({ when: when }));
    return axios.get(constants.baseEndpoint + 'modelproducts' + (when ? '/' + when : ''), { params: { page: pageIndex, page_size: pageSize, cid: cid, order_by: orderBy } })
      .then((resp) => {
        const data = resp.data;
        data.when = when;
        dispatch(action.success(data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetProducts = () => {
  const action = createAction(productActionName);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const fetchVirtualProductDetails = (pageIndex, pageSize) => {
  const action = createAction(productActionName);
  return (dispatch) => {
    dispatch(action.request());
    const params = { page: pageIndex, page_size: pageSize };
    return axios.get(constants.baseEndpoint + 'modelproducts/electronic_goods', { params })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
