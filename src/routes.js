import React from 'react';
import { Route, IndexRoute } from 'react-router';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory, FaqList } from 'containers/Faq';
import { Login } from 'containers/Login';
import { Register } from 'containers/Register';
import { UserProfile } from 'containers/User';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="login" component={Login} />
    <Route path="register" component={Register} />
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:id/:name" component={FaqList} />
    <Route path="user/profile" component={UserProfile}/>
    <Route status={404} path="*" component={Home} />
  </Route>
);
