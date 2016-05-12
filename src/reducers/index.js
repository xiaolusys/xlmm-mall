import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createReducer from './createReducer';
import orderReducer from './orderReducer';
import productReducer from './productReducer';
import couponsReducer from './couponsReducer';
import shopBagReducer from './shopBagReducer';
import * as categoriesAction from 'actions/faq/categories';
import * as questionsAction from 'actions/faq/questions';
import * as profileAction from 'actions/user/profile';
import * as loginAction from 'actions/user/login';
import * as passwordAction from 'actions/user/password';
import * as pointAction from 'actions/user/point';
import * as pointLogAction from 'actions/user/pointLog';
import * as complaintAction from 'actions/user/complaint';
import * as portalAction from 'actions/home/portal';
import * as orderAction from 'actions/order/order';
import * as logisticsAction from 'actions/order/logistics';
import * as addressAction from 'actions/user/address';
import * as provinceAction from 'actions/user/province';
import * as cityAction from 'actions/user/city';
import * as districtAction from 'actions/user/district';
import * as couponAction from 'actions/user/coupon';

const rootReducer = combineReducers({
  form: formReducer,
  categories: createReducer(categoriesAction.name),
  questions: createReducer(questionsAction.name),
  profile: createReducer(profileAction.name),
  address: createReducer(addressAction.name),
  login: createReducer(loginAction.name),
  password: createReducer(passwordAction.name),
  point: createReducer(pointAction.name),
  pointLog: createReducer(pointLogAction.name),
  complaint: createReducer(complaintAction.name),
  portal: createReducer(portalAction.name),
  product: productReducer,
  order: orderReducer,
  logistics: createReducer(logisticsAction.name),
  province: createReducer(provinceAction.name),
  city: createReducer(cityAction.name),
  district: createReducer(districtAction.name),
  coupon: createReducer(couponAction.name),
  shopBag: shopBagReducer,
  coupons: couponsReducer,
});

export default rootReducer;
