import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { categories as faqCategories } from './faq/categories';

const rootReducer = combineReducers({
  form: formReducer,
  faqCategories,
});

export default rootReducer;
