import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'SUMMER_MAT';

export const signUp = (administratorId) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post('/sale/weixingroup/xiaoluadministrator/mama_join', qs.stringify({ administrator_id: administratorId }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
