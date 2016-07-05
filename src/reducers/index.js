import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createReducer from './createReducer';
import orderReducer from './orderReducer';
import productsReducer from './productsReducer';
import couponsReducer from './couponsReducer';
import shopBagReducer from './shopBagReducer';
import verifyCodeReducer from './verifyCodeReducer';
import refundsReducer from './refundsReducer';
import examReducer from './examReducer';
import complaintsReducer from './complaintsReducer';
import * as categoriesAction from 'actions/faq/categories';
import * as questionsAction from 'actions/faq/questions';
import * as profileAction from 'actions/user/profile';
import * as loginAction from 'actions/user/login';
import * as passwordAction from 'actions/user/password';
import * as pointAction from 'actions/user/point';
import * as pointLogAction from 'actions/user/pointLog';
import * as complaintCommitAction from 'actions/complaint/commit';
import * as complaintHostoryAction from 'actions/complaint/list';
import * as portalAction from 'actions/home/portal';
import * as logisticsAction from 'actions/order/logistics';
import * as addressAction from 'actions/user/address';
import * as provinceAction from 'actions/user/province';
import * as cityAction from 'actions/user/city';
import * as districtAction from 'actions/user/district';
import * as couponAction from 'actions/user/coupon';
import * as productDetailsAction from 'actions/product/details';
import * as promotionAction from 'actions/activity/promotion';
import * as shareAction from 'actions/share';
import * as shareActivityAction from 'actions/share/activity';
import * as refundsDetailAction from 'actions/refunds/detail';
import * as commitOrderAction from 'actions/order/commit';
import * as payInfoAction from 'actions/order/payInfo';
import * as expressAction from 'actions/order/express';
import * as updateExpressAction from 'actions/order/updateExpress';
import * as expressInfoAction from 'actions/refunds/expressInfo';
import * as refundsApplyAction from 'actions/refunds/apply';
import * as shareRedpacketAction from 'actions/order/shareRedpacket';
import * as receiveRedpacketAction from 'actions/order/receiveRedpacket';
import * as usersRedpacketAction from 'actions/order/usersRedpacket';
import * as wechatSignAction from 'actions/wechat/sign';
import * as topTenAction from 'actions/activity/topTen';


const rootReducer = combineReducers({
  form: formReducer,
  categories: createReducer(categoriesAction.name),
  questions: createReducer(questionsAction.name),
  profile: createReducer(profileAction.name),
  address: createReducer(addressAction.name),
  login: createReducer(loginAction.name),
  verifyCode: verifyCodeReducer,
  password: createReducer(passwordAction.name),
  point: createReducer(pointAction.name),
  pointLog: createReducer(pointLogAction.name),
  complaintCommit: createReducer(complaintCommitAction.name),
  complaintHistory: complaintsReducer,
  portal: createReducer(portalAction.name),
  products: productsReducer,
  productDetails: createReducer(productDetailsAction.name),
  order: orderReducer,
  logistics: createReducer(logisticsAction.name),
  province: createReducer(provinceAction.name),
  city: createReducer(cityAction.name),
  district: createReducer(districtAction.name),
  coupon: createReducer(couponAction.name),
  shopBag: shopBagReducer,
  coupons: couponsReducer,
  promotion: createReducer(promotionAction.name),
  share: createReducer(shareAction.name),
  shareActivity: createReducer(shareActivityAction.name),
  refundsDetails: createReducer(refundsDetailAction.name),
  payInfo: createReducer(payInfoAction.name),
  commitOrder: createReducer(commitOrderAction.name),
  express: createReducer(expressAction.name),
  updateExpress: createReducer(updateExpressAction.name),
  expressInfo: createReducer(expressInfoAction.name),
  refundsList: refundsReducer,
  refundsApply: createReducer(refundsApplyAction.names.REFUNDS_APPLY),
  refundsOrder: createReducer(refundsApplyAction.names.FETCH_ORDER),
  exam: examReducer,
  shareRedpacket: createReducer(shareRedpacketAction.name),
  receiveRedpacket: createReducer(receiveRedpacketAction.name),
  usersRedpacket: createReducer(usersRedpacketAction.name),
  wechatSign: createReducer(wechatSignAction.name),
  topTen: createReducer(topTenAction.name),
});

export default rootReducer;
