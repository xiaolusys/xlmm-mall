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
        payload: resp.data || {},
        status: resp.status || 0,
        error: true,
      };
    },
  };
};

export default createAction;
