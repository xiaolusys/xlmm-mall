import * as actionTypes from '../actionTypes';
import * as constants from 'constants';
import axios from 'axios';

function request() {
  return {
    type: actionTypes.REQUEST,
  };
}

function success(data) {
  return {
    type: actionTypes.SUCCESS,
    payload: data,
  };
}

function failure(data) {
  return {
    type: actionTypes.FAILURE,
    payload: data,
    error: true,
  };
}

export function fetchCategories() {
  return (dispatch) => {
    dispatch(request());
    return axios.get(constants.baseEndpoint + 'faqs')
      .then((resp) => {
        dispatch(success(resp.data));
      })
      .catch((resp) => {
        dispatch(failure(resp.data));
      });
  };
}
