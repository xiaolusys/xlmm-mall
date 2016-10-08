import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'POINT';

export const fetchPoint = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'integral/get_owner_integral')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
