import React from 'react';
import { Route, IndexRoute } from 'react-router';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory, FaqList } from 'containers/Faq';
import { Login } from 'containers/Login';
import { Register } from 'containers/Register';
import { UserInfo, UserNickname, UserPhone } from 'containers/User';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="login" component={Login} />
    <Route path="register" component={Register} />
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:id/:name" component={FaqList} />
    <Route path="user" component={UserInfo}/>
    <Route path="user/nick" component={UserNickname}/>
    <Route path="user/phone" component={UserPhone}/>
    <Route status={404} path="*" component={Home} />
  </Route>
);
