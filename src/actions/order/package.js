import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = {
  FETCH_PACKAGES: 'FETCH_PACKAGES',
};

const fetchPackagesAction = createAction(name.FETCH_ORDERS);

export const fetchpPackages = (tradeid) => {
  const uri = '/rest/packageskuitem';
  const params = { params: { sale_trade_id: tradeid } };
  return (dispatch) => {
    dispatch(fetchPackagesAction.request());
    return axios.get(uri, params)
      .then((resp) => {
        dispatch(fetchPackagesAction.success(resp.data));
      })
      .catch((resp) => {
        dispatch(fetchPackagesAction.failure(resp));
      });
  };
};
