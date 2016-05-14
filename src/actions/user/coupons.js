import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'FETCH_COUPONS';

export const fetchCoupons = (status) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'usercoupons/get_user_coupons?status=' + status)
      .then((resp) => {
        const data = resp.data;
        data.status = status;
        data.coupons = resp.data;
        dispatch(action.success(data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
