import * as constants from 'constants';
import axios from 'axios';
import _ from 'underscore';
import createAction from '../createAction';

export const name = 'FETCH_PRODUCT';

export const fetchProduct = (when, pageIndex, pageSize, cid, orderBy) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request({ when: when }));
    return axios.get(constants.baseEndpoint + 'modelproducts' + (when ? '/' + when : ''), { params: { page: pageIndex, page_size: pageSize, cid: cid, order_by: orderBy } })
      .then((resp) => {
        const data = resp.data;
        data.when = when;
        dispatch(action.success(data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const resetProducts = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.reset());
  };
};
