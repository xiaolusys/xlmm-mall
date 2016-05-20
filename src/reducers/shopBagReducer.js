import * as shopBagAction from 'actions/shopBag';
import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';

const initState = {
  shopBag: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  shopBagHistory: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  shopBagQuantity: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  addProduct: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case shopBagAction.names.FETCH_SHOP_BAG + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { shopBag: { isLoading: true, success: false, error: false } });
    case shopBagAction.names.FETCH_SHOP_BAG + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { shopBag: { isLoading: false, data: action.payload, success: true, error: false } });
    case shopBagAction.names.FETCH_SHOP_BAG + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { shopBag: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    case shopBagAction.names.FETCH_SHOP_BAG_HISTORY + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { shopBagHistory: { isLoading: true, success: false, error: false } });
    case shopBagAction.names.FETCH_SHOP_BAG_HISTORY + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { shopBagHistory: { isLoading: false, data: action.payload, success: true, error: false } });
    case shopBagAction.names.FETCH_SHOP_BAG_HISTORY + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { shopBagHistory: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    case shopBagAction.names.ADD_PRODUCT_TO_SHOP_BAG + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { addProduct: { isLoading: true, success: false, error: false } });
    case shopBagAction.names.ADD_PRODUCT_TO_SHOP_BAG + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { addProduct: { isLoading: false, data: action.payload, success: true, error: false } });
    case shopBagAction.names.ADD_PRODUCT_TO_SHOP_BAG + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { addProduct: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    case shopBagAction.names.FETCH_SHOP_BAG_QUANTITY + '_' + actionTypes.REQUEST:
      return _.extend({}, state, { shopBagQuantity: { isLoading: true, success: false, error: false } });
    case shopBagAction.names.FETCH_SHOP_BAG_QUANTITY + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, { shopBagQuantity: { isLoading: false, data: action.payload, success: true, error: false } });
    case shopBagAction.names.FETCH_SHOP_BAG_QUANTITY + '_' + actionTypes.FAILURE:
      return _.extend({}, state, { shopBagQuantity: { isLoading: false, data: action.payload, success: false, error: true, status: action.status } });
    default:
      return state;
  }

};
