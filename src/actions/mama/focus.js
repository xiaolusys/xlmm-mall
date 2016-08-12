import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';
import qs from 'qs';

export const name = 'FOCUS_MAMA';

const action = createAction(name);

export const focusMamaById = (mamaId) => {
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(`${constants.baseEndpoint}fans/${mamaId}/bind_mama`)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetFocusMama = () => {
  return (dispatch) => {
    dispatch(action.reset());
  };
};
