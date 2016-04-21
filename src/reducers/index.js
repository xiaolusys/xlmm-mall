import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createReducer from './createReducer';
import * as categoriesAction from 'actions/faq/categories';
import * as questionsAction from 'actions/faq/questions';
import * as usersAction from 'actions/user/users';
import * as loginAction from 'actions/user/login';


const rootReducer = combineReducers({
  form: formReducer,
  categories: createReducer(categoriesAction.name),
  questions: createReducer(questionsAction.name),
  users: createReducer(usersAction.name),
  login: createReducer(loginAction.name),
});

export default rootReducer;
