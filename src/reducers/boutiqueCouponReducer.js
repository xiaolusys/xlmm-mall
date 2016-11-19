import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as boutiqueCouponAction from 'actions/mama/boutiqueCoupon';

const initState = {
  mamaBoutiqueCoupon: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case boutiqueCouponAction.names.FETCH_MAMA_BOUTIQUE_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaBoutiqueCoupon: { isLoading: true, data: state.mamaBoutiqueCoupon.data, error: false, success: false },
      });
    case boutiqueCouponAction.names.FETCH_MAMA_BOUTIQUE_COUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaBoutiqueCoupon: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.names.FETCH_MAMA_BOUTIQUE_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaBoutiqueCoupon: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case boutiqueCouponAction.names.FETCH_MAMA_BOUTIQUE_COUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        mamaBoutiqueCoupon: { isLoading: false, data: {}, error: false, success: false },
      });

    default:
      return state;
  }

};
