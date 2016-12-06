import * as actionTypes from 'actions/actionTypes';
import _ from 'underscore';
import * as boutiqueCouponAction from 'actions/mama/boutiqueCoupon';

const initState = {
  mamaTranCouponProfile: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  mamaLeftTranCoupon: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  mamaCanExchgOrders: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  exchangeOrder: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  verifyReturnCoupon: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  myReturnCoupon: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  tomeReturnCoupon: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  switch (action.type) {
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MAMA_TRANCOUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaTranCouponProfile: { isLoading: true, data: state.mamaTranCouponProfile.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MAMA_TRANCOUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaTranCouponProfile: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MAMA_TRANCOUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaTranCouponProfile: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MAMA_TRANCOUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        mamaTranCouponProfile: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MAMA_LEFT_TRANCOUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaLeftTranCoupon: { isLoading: true, data: state.mamaLeftTranCoupon.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MAMA_LEFT_TRANCOUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaLeftTranCoupon: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MAMA_LEFT_TRANCOUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaLeftTranCoupon: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MAMA_LEFT_TRANCOUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        mamaLeftTranCoupon: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.FETCH_CAN_EXCHG_ORDERS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        mamaCanExchgOrders: { isLoading: true, data: state.mamaCanExchgOrders.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_CAN_EXCHG_ORDERS + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        mamaCanExchgOrders: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_CAN_EXCHG_ORDERS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        mamaCanExchgOrders: { isLoading: false, data: action.payload, error: true, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_CAN_EXCHG_ORDERS + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        mamaCanExchgOrders: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.EXCHG_ORDER + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        exchangeOrder: { isLoading: true, data: state.exchangeOrder.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.EXCHG_ORDER + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        exchangeOrder: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.EXCHG_ORDER + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        exchangeOrder: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.EXCHG_ORDER + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        exchangeOrder: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.VERIFY_RETURN_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        verifyReturnCoupon: { isLoading: true, data: state.verifyReturnCoupon.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.VERIFY_RETURN_COUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        verifyReturnCoupon: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.VERIFY_RETURN_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        verifyReturnCoupon: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.VERIFY_RETURN_COUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        verifyReturnCoupon: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.FETCH_RETURN_COUPON_TO_ME + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        tomeReturnCoupon: { isLoading: true, data: state.tomeReturnCoupon.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_RETURN_COUPON_TO_ME + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        tomeReturnCoupon: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_RETURN_COUPON_TO_ME + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        tomeReturnCoupon: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_RETURN_COUPON_TO_ME + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        tomeReturnCoupon: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_RETURN_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        myReturnCoupon: { isLoading: true, data: state.myReturnCoupon.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_RETURN_COUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        myReturnCoupon: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_RETURN_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        myReturnCoupon: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_RETURN_COUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        myReturnCoupon: { isLoading: false, data: {}, error: false, success: false },
      });
    default:
      return state;
  }

};
