import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createReducer from './createReducer';
import * as successReducers from './successReducers';
import * as categoriesAction from 'actions/faq/categories';
import * as questionsAction from 'actions/faq/questions';
import * as profileAction from 'actions/user/profile';
import * as loginAction from 'actions/user/login';
import * as passwordAction from 'actions/user/password';
import * as portalAction from 'actions/home/portal';
import * as productAction from 'actions/home/product';
import * as orderAction from 'actions/order/order';
import * as logisticsAction from 'actions/order/logistics';
import * as addressAction from 'actions/user/address';
import * as provinceAction from 'actions/user/province';
import * as cityAction from 'actions/user/city';
import * as districtAction from 'actions/user/district';

const rootReducer = combineReducers({
  form: formReducer,
  categories: createReducer(categoriesAction.name),
  questions: createReducer(questionsAction.name),
  profile: createReducer(profileAction.name),
  address: createReducer(addressAction.name),
  login: createReducer(loginAction.name),
  password: createReducer(passwordAction.name),
  portal: createReducer(portalAction.name),
  product: createReducer(productAction.name, successReducers.productSuccessReducer),
  order: createReducer(orderAction.name),
  logistics: createReducer(logisticsAction.name),
  province: createReducer(provinceAction.name),
  city: createReducer(cityAction.name),
  district: createReducer(districtAction.name),
});

export default rootReducer;
