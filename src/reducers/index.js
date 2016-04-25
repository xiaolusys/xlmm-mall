import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createReducer from './createReducer';
import * as categoriesAction from 'actions/faq/categories';
import * as questionsAction from 'actions/faq/questions';
import * as profileAction from 'actions/user/profile';
import * as loginAction from 'actions/user/login';
import * as passwordAction from 'actions/user/password';
import * as posterAction from 'actions/home/poster';
import * as productAction from 'actions/home/product';
import * as activityAction from 'actions/home/activity';


const rootReducer = combineReducers({
  form: formReducer,
  categories: createReducer(categoriesAction.name),
  questions: createReducer(questionsAction.name),
  profile: createReducer(profileAction.name),
  login: createReducer(loginAction.name),
  password: createReducer(passwordAction.name),
  poster: createReducer(posterAction.name),
  product: createReducer(profileAction.name),
  activity: createReducer(activityAction.name),
});

export default rootReducer;
