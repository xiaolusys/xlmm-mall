import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createReducer from './createReducer';
import * as categoriesAction from 'actions/faq/categories';
import * as questionsAction from 'actions/faq/questions';
import * as loginAction from 'actions/user/login';
import * as verifyCodeAction from 'actions/user/verifyCode';

const rootReducer = combineReducers({
  form: formReducer,
  categories: createReducer(categoriesAction.name),
  questions: createReducer(questionsAction.name),
  login: createReducer(loginAction.name),
  verifyCode: createReducer(verifyCodeAction.name),
});

export default rootReducer;
