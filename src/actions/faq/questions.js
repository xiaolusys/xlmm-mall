import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'QUESTIONS';

export const fetchQuestions = (categoryId) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'faqs/get_question', { params: { main_category: categoryId } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
