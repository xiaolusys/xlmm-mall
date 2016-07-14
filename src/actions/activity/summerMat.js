import axios from 'axios';
import createAction from '../createAction';

export const name = 'SUMMER_MAT';

export const signUp = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post('/sale/weixingroup/xiaoluadministrator/mama_join')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
