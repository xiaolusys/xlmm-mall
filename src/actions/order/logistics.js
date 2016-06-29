import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'LOGISTICS';

export const fetchLogistics = (packetId, companyCode) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'wuliu/get_wuliu_by_packetid', { params: { packetid: packetId, company_code: companyCode } })
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
