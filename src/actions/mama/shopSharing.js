import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'FETCH_SHOP_SHARING';

export const fetchShopSharing = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(
        `${constants.baseEndpointV1}pmt/cushop/customer_shop`
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
