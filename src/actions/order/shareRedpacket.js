import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const name = 'FETCH_SHARE_REDPACKET';

export const fetchShareRedpacket = (tid) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'sharecoupon/create_order_share', qs.stringify({ uniq_id: tid }))
    .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
