import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

export default function configStore(state) {
  const logger = createLogger({
    collapsed: true,
    predicate: () =>
      process.env.NODE_ENV === 'development',
  });
  const middleware = applyMiddleware(thunkMiddleware, logger, apiMiddleware);
  const store = middleware(createStore)(rootReducer, state);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
