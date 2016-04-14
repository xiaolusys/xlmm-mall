import React from 'react';
import { Route, IndexRoute } from 'react-router';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory } from 'containers/FaqCategory';
import { FaqList } from 'containers/FaqList';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:categoryId/:categoryName" component={FaqList} />
    <Route status={404} path="*" component={Home} />
  </Route>
);
