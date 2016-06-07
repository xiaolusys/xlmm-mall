import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const name = 'COMMIT_ORDER';

export const commitOrder = (params) => {
  const action = createAction(name);
  const gaPayType = constants.gaPayTypes[params.channel];
  window.ga && window.ga('send', 'Pay', 'Request', gaPayType.lable, gaPayType.value);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpoint + 'trades/shoppingcart_create', qs.stringify(params))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
