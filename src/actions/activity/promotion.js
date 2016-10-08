import axios from 'axios';
import createAction from '../createAction';

export const name = 'PROMOTION';

export const fetchPromotion = (activityId) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get('/sale/promotion/apply/' + activityId + '/')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
