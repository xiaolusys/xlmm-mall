import axios from 'axios';
import createAction from '../createAction';

export const name = 'TOP_TEN';

export const fetchTopTen = (activityId) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get('/sale/promotion/promotion/goods/get_promotion_topic_pics', { params: { promotion_id: activityId } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
