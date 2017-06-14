import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const name = 'COMMIT_ORDER';

export const commitOrder = (params) => {
  const action = createAction(name);
  window.ga && window.ga('send', {
    hitType: 'event',
    eventCategory: 'Pay',
    eventAction: 'Request',
    eventLabel: constants.gaPayTypes[params.channel],
  });
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'trades/shoppingcart_create', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const buyNowCommitOrder = (params) => {
  const action = createAction(name);
  window.ga && window.ga('send', {
    hitType: 'event',
    eventCategory: 'Pay',
    eventAction: 'Request',
    eventLabel: constants.gaPayTypes[params.channel],
  });
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'trades/buynow_create', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

