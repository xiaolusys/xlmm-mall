import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'RECRUIT_MAMA';

export const recruitMama = (id, phone) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(
        constants.baseEndpoint + 'mama/recruit_elite_mama', qs.stringify({ mama_id: id, mama_phone: phone })
      )
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
