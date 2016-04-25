import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'ACTIVITY';

export const fetchActivity = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'activitys')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
