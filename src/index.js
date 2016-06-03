import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import configStore from './store/configStore';
import routes from 'routes';

const history = useRouterHistory(createHistory)({
  basename: '/mall/',
  queryKey: false,
});
const store = configStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.querySelector('#container')
);
