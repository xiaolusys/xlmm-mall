import * as constants from 'constants';
import axios from 'axios';
import createAction from 'actions/createAction';
import qs from 'qs';

export const names = {
  FETCH_NOTIFICATIONS: 'FETCH_NOTIFICATIONS',
  READ_NOTIFICATION: 'READ_NOTIFICATION',
};

export const fetchNotifications = (pageIndex, pageSize, timeStamp) => {
  const action = createAction(names.FETCH_NOTIFICATIONS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(`${constants.baseEndpoint}mama/message/read_list`, { params: { page: pageIndex, page_size: pageSize, t: timeStamp } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
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
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
