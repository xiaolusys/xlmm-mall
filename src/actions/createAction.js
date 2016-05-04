import * as actionTypes from './actionTypes';

const createAction = (name) => {
  return {
    request: () => {
      return {
        type: name + '_' + actionTypes.REQUEST,
      };
    },
    success: (data) => {
      return {
        type: name + '_' + actionTypes.SUCCESS,
        payload: data,
      };
    },
    failure: (data) => {
      return {
        type: name + '_' + actionTypes.FAILURE,
        payload: data,
        error: true,
      };
    },
  };
};

export default createAction;
