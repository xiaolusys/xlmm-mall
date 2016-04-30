import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'ORDERS';

export const fetchOrders = (type, pageIndex, pageSize) => {
  const action = createAction(name);
  const uri = constants.baseEndpoint + 'trades' + (type ? '/' + type : '');
  const params = { params: { page: pageIndex, pageSize: pageSize } };
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(uri, params)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
