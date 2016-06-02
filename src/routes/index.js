import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

// routes
import activityRoutes from './activityRoutes';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { FaqCategory, FaqList } from 'containers/Faq';
import { SmsLogin, LoginHome, PasswordLogin, Password, UserProfile, UserPhone, Nickname, AddressList, EditAddress, Point, CouponList, Complaint } from 'containers/User';
import { OrderList, OrderDetail, Logistics, OrderCommit } from 'containers/Order';
import { ShopBag } from 'containers/ShopBag';
import { ProductDetails, ProductList } from 'containers/Product';
import { RefundsList, ExpressCompany, RefundsDetail, ExpressOrder } from 'containers/Refunds';
import { Alipay } from 'containers/Alipay';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/user/profile" component={UserProfile} onEnter={utils.checkAuth} />
    <Route path="/user/profile/phone" component={UserPhone} onEnter={utils.checkAuth} />
    <Route path="/user/nickname" component={Nickname} onEnter={utils.checkAuth} />
    <Route path="/user/address" component={AddressList} onEnter={utils.checkAuth} />
    <Route path="/user/address/edit/:id" component={EditAddress} onEnter={utils.checkAuth} />
    <Route path="/user/login" component={LoginHome} />
    <Route path="/user/login/password" component={PasswordLogin} />
    <Route path="/user/login/sms" component={SmsLogin} />
    <Route path="/user/register" component={Password} />
    <Route path="/user/password/reset" component={Password}/>
    <Route path="/user/password/set" component={Password} onEnter={utils.checkAuth} />
    <Route path="/user/point" component={Point} onEnter={utils.checkAuth} />
    <Route path="/user/coupons" component={CouponList} onEnter={utils.checkAuth} />
    <Route path="/user/complaint" component={Complaint} onEnter={utils.checkAuth} />
    <Route path="/order/:type" component={OrderList} onEnter={utils.checkAuth} />
    <Route path="/order/detail/:id" component={OrderDetail} onEnter={utils.checkAuth} />
    <Route path="/order/logistics/:id" component={Logistics} onEnter={utils.checkAuth} />
    <Route path="/oc" component={OrderCommit} onEnter={utils.checkAuth} />
    <Route path="/shop/bag" component={ShopBag} onEnter={utils.checkAuth} />
    <Route path="/product/details/:id" component={ProductDetails} />
    <Route path="/product/list/:type" component={ProductList} />
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:id/:name" component={FaqList} />
    <Route path="/refunds/details/:id" component={RefundsDetail} />
    <Route path="/refunds/express/order/:id/:name" component={ExpressOrder} />
    <Route path="/refunds/express/company/:id" component={ExpressCompany} />
    <Route path="/refunds" component={RefundsList} />
    <Route path="/alipay" component={Alipay} />
    {activityRoutes}
    <Route status={404} path="*" component={Home} />
  </Route>
);
