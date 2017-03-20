import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const searchNames = {
  SEARCH_PRODUCT: 'SEARCH_PRODUCT',
  SEARCH_HISTORY: 'SEARCH_HISTORY',
  CLEAR_SEARCH_HISTORY: 'CLEAR_SEARCH_HISTORY',
};

export const searchProduct = (name, type = 0) => {
  const action = createAction(searchNames.SEARCH_PRODUCT);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'modelproducts/search_by_name?name=' + name + '&product_type=' + type)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetSearchProduct = () => {
  const action = createAction(searchNames.SEARCH_PRODUCT);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const fetchSearchProductHistory = () => {
  const action = createAction(searchNames.SEARCH_HISTORY);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'searchhistory/product_search_history')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetFetchSearchProductHistory = () => {
  const action = createAction(searchNames.SEARCH_HISTORY);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const clearSearchProductHistory = () => {
  const action = createAction(searchNames.CLEAR_SEARCH_HISTORY);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'searchhistory/clear_search_history', qs.stringify({ target: 'ModelProduct' }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
