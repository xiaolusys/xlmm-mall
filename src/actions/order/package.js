import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'FETCH_PACKAGES';

export const fetchPackages = (tradeid) => {
  const action = createAction(name);
  const uri = '/rest/packageskuitem';
  const params = { params: { sale_trade_id: tradeid } };
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(uri, params)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
