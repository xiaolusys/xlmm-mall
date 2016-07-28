import * as constants from 'constants';
import axios from 'axios';
import createAction from 'actions/createAction';
import qs from 'qs';
export const name = 'FETCH_ACTIVITY';
export const fetchActivity = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'activitys/get_all_events')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
