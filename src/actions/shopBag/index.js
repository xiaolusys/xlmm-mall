import * as constants from 'constants';
import axios from 'axios';
import qs from 'qs';
import createAction from '../createAction';

export const names = {
  FETCH_SHOP_BAG: 'FETCH_SHOP_BAG',
  FETCH_SHOP_BAG_HISTORY: 'FETCH_SHOP_BAG_HISTORY',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REBUY_HISTORY_PRODUCT: 'REBUY_HISTORY_PRODUCT',
  ADD_PRODUCT_TO_SHOP_BAG: 'ADD_PRODUCT_TO_SHOP_BAG',
};

export const fetchShopBag = () => {
  const action = createAction(names.FETCH_SHOP_BAG);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'carts')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const fetchShopBagHistory = () => {
  const action = createAction(names.FETCH_SHOP_BAG_HISTORY);
  return (dispatch) => {
    dispatch(action.request());
    return axios.get(constants.baseEndpointV1 + 'carts/show_carts_history')
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

/**
 * @id number
 * @action 增加：plus_product_carts 减少: minus_product_carts
 *
 */
export const updateQuantity = (id, requestAction) => {
  const action = createAction(names.UPDATE_QUANTITY);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'carts/' + id + '/' + requestAction)
      .then((resp) => {
        if (resp.data.status === 1) {
          dispatch(fetchShopBag());
        }
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const rebuy = (itemId, skuId, cartId) => {
  const action = createAction(names.REBUY_HISTORY_PRODUCT);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'carts', qs.stringify({ item_id: itemId, sku_id: skuId, cart_id: cartId }))
      .then((resp) => {
        if (resp.data.code === 0) {
          dispatch(fetchShopBag());
          dispatch(fetchShopBagHistory());
        }
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const addProductToShopBag = (productId, skuId, num) => {
  const action = createAction(names.ADD_PRODUCT_TO_SHOP_BAG);
  return (dispatch) => {
    dispatch(action.request());
    return axios.post(constants.baseEndpointV1 + 'carts', qs.stringify({ item_id: productId, sku_id: skuId, num: num }))
      .then((resp) => {
        dispatch(action.success(resp.data));
      })
      .catch((resp) => {
        dispatch(action.failure(resp.data));
      });
  };
};

export const resetAddProductToShopBag = () => {
  const action = createAction(names.ADD_PRODUCT_TO_SHOP_BAG);
  return (dispatch) => {
    dispatch(action.request());
  };
};
