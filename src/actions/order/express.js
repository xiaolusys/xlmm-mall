import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'EXPRESS';

export const fetchLogisticsCompanies = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'address/get_logistic_companys')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
