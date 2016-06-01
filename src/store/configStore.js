import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

export default function configStore(state) {
  const logger = createLogger({
    collapsed: true,
    predicate: () =>
      process.env.NODE_ENV === 'development',
  });
  const middleware = applyMiddleware(thunkMiddleware, logger);
  const store = middleware(createStore)(rootReducer, state, window.devToolsExtension && window.devToolsExtension());

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
