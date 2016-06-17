import * as examAction from 'actions/exam';
import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';

const initState = {
  info: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  result: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  question: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  answer: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case examAction.names.FETCH_EXAM_INFO + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { info: { isLoading: true, data: {}, success: false, error: false } });
    case examAction.names.FETCH_EXAM_INFO + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { info: { isLoading: false, data: action.payload, success: true, error: false } });
    case examAction.names.FETCH_EXAM_INFO + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { info: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    case examAction.names.FETCH_EXAM_RESULT + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { result: { isLoading: true, data: {}, success: false, error: false } });
    case examAction.names.FETCH_EXAM_RESULT + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { result: { isLoading: false, data: action.payload, success: true, error: false } });
    case examAction.names.FETCH_EXAM_RESULT + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { result: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    case examAction.names.FETCH_EXAM_QUESTION + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { question: { isLoading: true, data: {}, success: false, error: false } });
    case examAction.names.FETCH_EXAM_QUESTION + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { question: { isLoading: false, data: action.payload, success: true, error: false } });
    case examAction.names.FETCH_EXAM_QUESTION + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { question: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    case examAction.names.COMMIT_ANSWER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { answer: { isLoading: true, data: {}, success: false, error: false } });
    case examAction.names.COMMIT_ANSWER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { answer: { isLoading: false, data: action.payload, success: true, error: false } });
    case examAction.names.COMMIT_ANSWER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { answer: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    default:
      return state;
  }

};
