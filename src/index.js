import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import configStore from './store/configStore';
import routes from 'routes';

const history = useRouterHistory(createHashHistory)({ queryKey: false });
const store = configStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.querySelector('#container')
);
