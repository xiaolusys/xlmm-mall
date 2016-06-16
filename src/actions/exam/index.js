import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const names = {
  FETCH_EXAM_INFO: 'FETCH_EXAM_INFO',
  FETCH_EXAM_RESULT: 'FETCH_EXAM_RESULT',
  FETCH_EXAM_QUESTION: 'FETCH_EXAM_QUESTION',
  COMMIT_ANSWER: 'COMMIT_ANSWER',
};

export const fetchExamInfo = () => {
  const action = createAction(names.FETCH_EXAM_INFO);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'mmexam/get_start_page_info')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const fetchExamQuestion = (type = 1, id) => {
  const action = createAction(names.FETCH_EXAM_QUESTION);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'mmexam/get_mmexam_question', { params: { question_type: type, question_id: id } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const commitAnswer = (id, answer) => {
  const action = createAction(names.COMMIT_ANSWER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'mmexam/create_answer_detail', { params: { question_id: id, answer: answer } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const fetchExamResult = () => {
  const action = createAction(names.FETCH_EXAM_RESULT);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'mmexam/get_start_page_info')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
