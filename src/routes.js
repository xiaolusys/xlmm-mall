import React from 'react';
import { Route, IndexRoute } from 'react-router';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory, FaqList } from 'containers/Faq';
import { Login, Register, ResetPassword, UserProfile } from 'containers/User';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/user/profile" component={UserProfile}/>
    <Route path="/user/login" component={Login} />
    <Route path="/user/register" component={Register} />
    <Route path="/user/password/reset" component={ResetPassword} />
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:id/:name" component={FaqList} />
    <Route status={404} path="*" component={Home} />
  </Route>
);
