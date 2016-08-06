import * as constants from 'constants';
import axios from 'axios';
import createAction from 'actions/createAction';
import qs from 'qs';

export const names = {
  FETCH_NOTIFICATIONS: 'FETCH_NOTIFICATIONS',
  READ_NOTIFICATION: 'READ_NOTIFICATION',
};

export const fetchNotifications = (pageIndex, pageSize) => {
  const action = createAction(names.FETCH_NOTIFICATIONS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/message/self_list`, { params: { page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .then((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const resetNotifications = () => {
  const action = createAction(names.FETCH_NOTIFICATIONS);
  return (dispatch) => {
    dispatch(action.reset());
  };
};

export const readNotification = (notificationid) => {
  const action = createAction(names.READ_NOTIFICATION);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/message/${notificationid}/read`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .then((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
