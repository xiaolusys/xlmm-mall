import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'EXPIREDCOUPON';

export const fetchExpiredCoupons = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'usercoupons/list_past_coupon')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
