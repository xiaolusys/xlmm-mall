import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createReducer from './createReducer';
import * as successReducers from './successReducers';
import * as categoriesAction from 'actions/faq/categories';
import * as questionsAction from 'actions/faq/questions';
import * as profileAction from 'actions/user/profile';
import * as addressAction from 'actions/user/address';
import * as loginAction from 'actions/user/login';
import * as passwordAction from 'actions/user/password';
import * as portalAction from 'actions/home/portal';
import * as productAction from 'actions/home/product';
import * as orderAction from 'actions/order/order';
import * as provinceAction from 'actions/address/province';
import * as cityAction from 'actions/address/city';
import * as regionAction from 'actions/address/region';

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
  province: createReducer(provinceAction.name),
  city: createReducer(cityAction.name),
  region: createReducer(regionAction.name),
});

export default rootReducer;
