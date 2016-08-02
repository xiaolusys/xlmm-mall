import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';

export const names = {
  FETCH_FAVORITE_LIST: 'FETCH_FAVORITE_LIST',
  ADD_FAVORITE: 'ADD_FAVORITE',
  UN_FAVORITE: 'UN_FAVORITE',
};

export const fetchFavoriteList = (shelfStatus) => {
  const action = createAction(names.FETCH_FAVORITE_LIST);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'favorites', { shelf_status: shelfStatus })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const resetFavorite = () => {
  const action = createAction(names.FETCH_FAVORITE_LIST);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const addFavorite = (modelId) => {
  const action = createAction(names.ADD_FAVORITE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'favorites', { params: { model_id: modelId } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const unFavorite = (modelId) => {
  const action = createAction(names.UN_FAVORITE);
  return (dispatch) => {
    dispatch(action.request());
    return axios.delete(constants.baseEndpointV1 + 'favorites', { params: { model_id: modelId } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
