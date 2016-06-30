import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import _ from 'underscore';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import configStore from './store/configStore';
import routes from 'routes';

const store = configStore();
const history = useRouterHistory(createHistory)({
  basename: '/mall/',
  queryKey: false,
});

// send pageview to ga
history.listen((location) => {
  window.ga && window.ga('send', 'pageview', location.pathname);
});
_.extend(history, {
  goSmartBack: () => {
    if (window.history.length >= 1 && window.history.length <= 2) {
      history.push('/');
    } else {
      history.goBack();
    }
  },
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.querySelector('#container')
);
