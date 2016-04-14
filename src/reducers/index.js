import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createReducer from './createReducer';
import * as categoriesAction from 'actions/faq/categories';
import * as questionsAction from 'actions/faq/questions';

const rootReducer = combineReducers({
  form: formReducer,
  categories: createReducer(categoriesAction.name),
  questions: createReducer(questionsAction.name),
});

export default rootReducer;
