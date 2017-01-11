import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as searchAction from 'actions/product/search';

const initState = {
  searchProduct: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  fetchSearchHis: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  clearSearchHis: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  const payload = action.payload;
  switch (action.type) {
    case searchAction.searchNames.SEARCH_PRODUCT + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        searchProduct: { isLoading: true, data: state.searchProduct.data, error: false, success: false },
      });
    case searchAction.searchNames.SEARCH_PRODUCT + '_' + actionTypes.SUCCESS:
      payload.results = _.chain(state.searchProduct.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        searchProduct: { isLoading: false, data: payload, error: false, success: true },
      });
    case searchAction.searchNames.SEARCH_PRODUCT + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        searchProduct: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case searchAction.searchNames.SEARCH_PRODUCT + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        searchProduct: { isLoading: false, data: {}, error: false, success: false },
      });

    case searchAction.searchNames.SEARCH_HISTORY + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        fetchSearchHis: { isLoading: true, data: state.fetchSearchHis.data, error: false, success: false },
      });
    case searchAction.searchNames.SEARCH_HISTORY + '_' + actionTypes.SUCCESS:
      payload.results = _.chain(state.fetchSearchHis.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        fetchSearchHis: { isLoading: false, data: payload, error: false, success: true },
      });
    case searchAction.searchNames.SEARCH_HISTORY + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        fetchSearchHis: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case searchAction.searchNames.SEARCH_HISTORY + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        fetchSearchHis: { isLoading: false, data: {}, error: false, success: false },
      });

    case searchAction.searchNames.CLEAR_SEARCH_HISTORY + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        clearSearchHis: { isLoading: true, data: state.clearSearchHis.data, error: false, success: false },
      });
    case searchAction.searchNames.CLEAR_SEARCH_HISTORY + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        clearSearchHis: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case searchAction.searchNames.CLEAR_SEARCH_HISTORY + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        clearSearchHis: { isLoading: false, data: action.payload, error: true, success: false },
      });
    default:
      return state;
  }

};
