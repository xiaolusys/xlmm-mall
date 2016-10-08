import * as actionTypes from './actionTypes';

const createAction = (name) => {
  return {
    request: (data) => {
      return {
        type: name + '_' + actionTypes.REQUEST,
        payload: data || {},
      };
    },
    success: (data) => {
      return {
        type: name + '_' + actionTypes.SUCCESS,
        payload: data || {},
      };
    },
    failure: (resp) => {
      return {
        type: name + '_' + actionTypes.FAILURE,
        payload: resp.response ? resp.response.data : {},
        status: resp.response ? resp.response.status : 0,
        error: true,
      };
    },
    reset: () => {
      return {
        type: name + '_' + actionTypes.RESET,
        error: false,
        success: false,
        isLoading: false,
        payload: {},
      };
    },
  };
};

export default createAction;
