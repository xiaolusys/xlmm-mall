import * as constants from 'constants';
import axios from 'axios';
import createAction from 'actions/createAction';
import qs from 'qs';

export const names = { FETCH_COURSE: 'FETCH_COURSE', READ_COURSE: 'READ_COURSE' };

export const fetchCourse = (pageIndex, pageSize, lessonType, orderingBy) => {
  const action = createAction(names.FETCH_COURSE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'lesson/lessontopic', { params: { page: pageIndex, page_size: pageSize, lesson_type: lessonType, ordering: orderingBy } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetCourse = () => {
  const action = createAction(names.FETCH_COURSE);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const readCourse = (courseId) => {
  const action = createAction(names.READ_COURSE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.patch(constants.baseEndpointV1 + 'lesson/lessontopic/' + courseId, { params: { num_attender: 1 } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
