import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  FETCH_MAMA_BOUTIQUE_COUPON: 'FETCH_MAMA_BOUTIQUE_COUPON',

};

export const fetchMamaBoutiqueCoupon = () => {
  const action = createAction(names.FETCH_MAMA_BOUTIQUE_COUPON);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/fortune`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
