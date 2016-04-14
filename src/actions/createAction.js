import * as actionTypes from './actionTypes';

const createAction = (name) => {
  return {
    request: () => {
      return {
        type: actionTypes.REQUEST + '_' + name,
      };
    },
    success: (data) => {
      return {
        type: actionTypes.SUCCESS + '_' + name,
        payload: data,
      };
    },
    failure: (data) => {
      return {
        type: actionTypes.FAILURE + '_' + name,
        payload: data,
      };
    },
  };
};

export default createAction;
