import React from 'react';
import { Route, IndexRoute } from 'react-router';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory, FaqList } from 'containers/Faq';
import { Login, Password, UserProfile, UserPhone, Nickname } from 'containers/User';
import { AddressList } from 'containers/User/Address';
import { OrderList, OrderDetail, Logistics } from 'containers/Order';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/user/profile" component={UserProfile}/>
    <Route path="/user/profile/phone" component={UserPhone}/>
    <Route path="/user/nickname" component={Nickname} />
    <Route path="/user/address" component={AddressList} />
    <Route path="/user/login" component={Login} />
    <Route path="/user/register" component={Password} />
    <Route path="/user/password/reset" component={Password}/>
    <Route path="/user/password/set" component={Password}/>
    <Route path="/order/:type" component={OrderList}/>
    <Route path="/order/detail/:id" component={OrderDetail}/>
    <Route path="/order/logistics/:id" component={Logistics}/>
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:id/:name" component={FaqList} />
    <Route status={404} path="*" component={Home} />
  </Route>
);
