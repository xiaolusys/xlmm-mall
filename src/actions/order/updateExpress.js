import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'UPDATEEXPRESS';

export const changeLogisticsCompany = (addressid) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'address/' + addressid + '/change_company_code')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
