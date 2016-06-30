import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';
import * as orderAction from 'actions/order/order';

export const name = 'UPDATEEXPRESS';

export const changeLogisticsCompany = (addressid, tid, companyCode, tradeid) => {
  const action = createAction(name);
  const params = { referal_trade_id: tradeid, logistic_company_code: companyCode };
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'address/' + addressid + '/change_company_code', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
        dispatch(orderAction.fetchOrder(tid));
      })
      .catch((resp) => {
        dispatch(action.failure(resp));
      });
  };
};
