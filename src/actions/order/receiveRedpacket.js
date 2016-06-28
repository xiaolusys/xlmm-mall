import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const name = 'RECEIVE_REDPACKET';

export const fetchReceiveRedpacket = (tid, mobile) => {
  const action = createAction(name);
  let uri = 'sharecoupon/pick_order_share_coupon';
  if (mobile) {
    uri = 'tmpsharecoupon';
  }
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + uri, qs.stringify({ uniq_id: tid, mobile: mobile }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
