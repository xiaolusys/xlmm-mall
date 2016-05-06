import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory, FaqList } from 'containers/Faq';
import { Login, Password, UserProfile, UserPhone, Nickname, AddressList, EditAddress, Point, Coupon } from 'containers/User';
import { OrderList, OrderDetail, Logistics } from 'containers/Order';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/user/profile" component={UserProfile} onEnter={utils.checkAuth} />
    <Route path="/user/profile/phone" component={UserPhone} onEnter={utils.checkAuth} />
    <Route path="/user/nickname" component={Nickname} onEnter={utils.checkAuth} />
    <Route path="/user/address" component={AddressList} onEnter={utils.checkAuth} />
    <Route path="/user/address/edit/:id" component={EditAddress} onEnter={utils.checkAuth} />
    <Route path="/user/login" component={Login} />
    <Route path="/user/register" component={Password} />
    <Route path="/user/password/reset" component={Password}/>
    <Route path="/user/password/set" component={Password} onEnter={utils.checkAuth} />
    <Route path="/user/point" component={Point} onEnter={utils.checkAuth} />
    <Route path="/user/coupon" component={Coupon} onEnter={utils.checkAuth} />
    <Route path="/order/:type" component={OrderList} onEnter={utils.checkAuth} />
    <Route path="/order/detail/:id" component={OrderDetail} onEnter={utils.checkAuth} />
    <Route path="/order/logistics/:id" component={Logistics} onEnter={utils.checkAuth} />
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:id/:name" component={FaqList} />
    <Route status={404} path="*" component={Home} />
  </Route>
);
