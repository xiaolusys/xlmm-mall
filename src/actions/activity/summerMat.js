import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const names = {
  SIGN_UP: 'SIGN_UP',
  FETCH_MUM_INFO: 'FETCH_MUM_INFO',
  FETCH_REGISTERS: 'FETCH_REGISTERS',
  REGISTER: 'REGISTER',
  FETCH_USER_INFO: 'FETCH_USER_INFO',
};

export const signUp = (administratorId) => {
  const action = createAction(names.SIGN_UP);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post('/sale/weixingroup/xiaoluadministrator/mama_join', qs.stringify({ administrator_id: administratorId }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchMumInfo = (fansId) => {
  const action = createAction(names.FETCH_MUM_INFO);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get('/sale/weixingroup/liangxi/' + fansId + '/detail')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchRegisters = (groupId, pageIndex, pageSize) => {
  const action = createAction(names.FETCH_REGISTERS);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get('/sale/weixingroup/liangxi/get_group_users', { params: { group_id: groupId, page: pageIndex, page_size: pageSize } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const register = (groupId) => {
  const action = createAction(names.REGISTER);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get('/sale/weixingroup/liangxi/join', { params: { group_id: groupId } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const fetchUserInfo = () => {
  const action = createAction(names.FETCH_USER_INFO);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get('/sale/weixingroup/mamagroups/get_self_info')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
