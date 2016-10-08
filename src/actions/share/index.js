import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'FETCH_SHARE_INFO';

export const fetchShareInfo = (type, id) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'share/' + type, { params: { model_id: id } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
