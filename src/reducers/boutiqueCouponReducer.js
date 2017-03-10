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
  cancelReturn: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  returnFreeze: {
    isLoading: false,
    error: false,
    success: false,
    data: [],
  },
  myInCoupon: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  myOutCoupon: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  cancelTransfer: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  sendTransfer: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
  processTransfer: {
    isLoading: false,
    error: false,
    success: false,
    data: {},
  },
};

export default (state = initState, action = null) => {
  let payload = {};
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
      payload = action.payload;
      payload.results = _.chain(state.tomeReturnCoupon.data.results || []).union(payload.results || []).unique('id').value();
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
      payload = action.payload;
      payload.results = _.chain(state.myReturnCoupon.data.results || []).union(payload.results || []).unique('id').value();
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

    case boutiqueCouponAction.boutiqueCouponNames.CANCEL_RETURN_TRANSFER_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        cancelReturn: { isLoading: true, data: state.cancelReturn.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.CANCEL_RETURN_TRANSFER_COUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        cancelReturn: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.CANCEL_RETURN_TRANSFER_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        cancelReturn: { isLoading: false, data: action.payload, error: true, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.RETURN_FREEZE_COUPONS + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        returnFreeze: { isLoading: true, data: state.returnFreeze.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.RETURN_FREEZE_COUPONS + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        returnFreeze: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.RETURN_FREEZE_COUPONS + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        returnFreeze: { isLoading: false, data: action.payload, error: true, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_IN_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        myInCoupon: { isLoading: true, data: state.myInCoupon.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_IN_COUPON + '_' + actionTypes.SUCCESS:
      payload = action.payload;
      payload.results = _.chain(state.myInCoupon.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        myInCoupon: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_IN_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        myInCoupon: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_IN_COUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        myInCoupon: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_OUT_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        myOutCoupon: { isLoading: true, data: state.myOutCoupon.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_OUT_COUPON + '_' + actionTypes.SUCCESS:
      payload = action.payload;
      payload.results = _.chain(state.myOutCoupon.data.results || []).union(payload.results || []).unique('id').value();
      return _.extend({}, state, {
        myOutCoupon: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_OUT_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        myOutCoupon: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.FETCH_MY_OUT_COUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        myOutCoupon: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.CANCEL_TRANSFER_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        cancelTransfer: { isLoading: true, data: state.cancelTransfer.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.CANCEL_TRANSFER_COUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        cancelTransfer: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.CANCEL_TRANSFER_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        cancelTransfer: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.CANCEL_TRANSFER_COUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        cancelTransfer: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.SEND_TRANSFER_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        sendTransfer: { isLoading: true, data: state.sendTransfer.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.SEND_TRANSFER_COUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        sendTransfer: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.SEND_TRANSFER_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        sendTransfer: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.SEND_TRANSFER_COUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        sendTransfer: { isLoading: false, data: {}, error: false, success: false },
      });

    case boutiqueCouponAction.boutiqueCouponNames.PROCESS_TRANSFER_COUPON + '_' + actionTypes.REQUEST:
      return _.extend({}, state, {
        processTransfer: { isLoading: true, data: state.processTransfer.data, error: false, success: false },
      });
    case boutiqueCouponAction.boutiqueCouponNames.PROCESS_TRANSFER_COUPON + '_' + actionTypes.SUCCESS:
      return _.extend({}, state, {
        processTransfer: { isLoading: false, data: action.payload, error: false, success: true },
      });
    case boutiqueCouponAction.boutiqueCouponNames.PROCESS_TRANSFER_COUPON + '_' + actionTypes.FAILURE:
      return _.extend({}, state, {
        processTransfer: { isLoading: false, data: action.payload, error: true, success: false, status: action.status },
      });
    case boutiqueCouponAction.boutiqueCouponNames.PROCESS_TRANSFER_COUPON + '_' + actionTypes.RESET:
      return _.extend({}, state, {
        processTransfer: { isLoading: false, data: {}, error: false, success: false },
      });

    default:
      return state;
  }

};
