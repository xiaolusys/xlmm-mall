import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';
import * as cityAction from 'actions/user/city';

export const name = 'PROVINCE';

export const fetchProvinces = (address) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'districts/province_list')
      .then((resp) => {
        dispatch(action.success(resp.data));
        if (address) {
          let id = 0;
          _.each(resp.data, (item, index) => {
            if (address.receiver_state.indexOf(item.name) >= 0) {
              id = item.id;
            }
          });
          dispatch(cityAction.fetchCities(id, address));
        }
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
