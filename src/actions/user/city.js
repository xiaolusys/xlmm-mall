import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import _ from 'underscore';
import createAction from '../createAction';
import * as districtAction from 'actions/user/district';

export const name = 'CITY';

export const fetchCities = (provinceId, address) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'districts/city_list?id=' + provinceId)
      .then((resp) => {
        dispatch(action.success(resp.data));
        if (address) {
          let id = 0;
          _.each(resp.data.data, (item, index) => {
            if (address.receiver_city.indexOf(item.name) >= 0) {
              id = item.id;
            }
          });
          dispatch(districtAction.fetchDistricts(id));
        }
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};
