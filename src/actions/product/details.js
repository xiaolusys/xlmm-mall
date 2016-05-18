import * as constants from 'constants';
import axios from 'axios';
import createAction from '../createAction';

export const name = 'FETCH_PRODUCT_DETAILS';

export const fetchProductDetails = (id) => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpoint + 'modelproducts/' + id)
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const resetProductDetails = () => {
  const action = createAction(name);
  return (dispatch) => {
    dispatch(action.request());
  };
};
