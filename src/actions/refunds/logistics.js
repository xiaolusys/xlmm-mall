import axios from 'axios';
import createAction from '../createAction';
import * as constants from 'constants';
import qs from 'qs';

export const name = 'FETCH_LOGISTICS';

export const fetchRefundsLogistics = (refundId, packageId, companyName) => {
  const action = createAction(name);
  const params = { params: { rid: refundId, packetid: packageId, company_name: companyName } };

  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'rtnwuliu/get_wuliu_by_packetid', params)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};

export const resetRefundsLogistics = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.reset());
  };
};
