import React from 'react';
import { Route, IndexRoute } from 'react-router';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory, FaqList } from 'containers/Faq';
import { Login } from 'containers/Login';
import { User } from 'containers/User';
import { ChangeNick } from 'containers/User/ChangeNick';
import { BindCellNumber } from 'containers/User/BindCellNumber';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="login" component={Login} />
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:id/:name" component={FaqList} />
    <Route path="user" component={User}/>
    <Route path="user/changeNick" component={ChangeNick}/>
    <Route path="user/bindCellNumber" component={BindCellNumber}/>
    <Route status={404} path="*" component={Home} />
  </Route>
);
