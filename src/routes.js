import React from 'react';
import { Route, IndexRoute } from 'react-router';

/* containers */
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory, FaqList } from 'containers/Faq';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="faq" component={FaqCategory}>
      <Route path="list" component={FaqList} />
    </Route>
    <Route status={404} path="*" component={Home} />
  </Route>
);
