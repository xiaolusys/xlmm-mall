import axios from 'axios';
import createAction from '../createAction';

export const name = 'TOPTEN';

export const fetchTopTen = (activityId) => {
  const action = createAction(name);
  const params = { promotion_id: activityId };
  return (dispatch) => {
    dispatch(action.request());
    return axios.get('/sale/promotion/promotion/goods/get_promotion_topic_pics', params)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
