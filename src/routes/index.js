import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

// routes
import activityRoutes from './activityRoutes';

// containers
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { ShopBag } from 'containers/ShopBag';
import { Alipay } from 'containers/Alipay';

import {
  FaqCategory,
  FaqList,
} from 'containers/Faq';

import {
  SmsLogin,
  LoginHome,
  PasswordLogin,
  Password,
  UserProfile,
  UserPhone,
  Nickname,
  AddressList,
  EditAddress,
  Point,
  CouponList,
  CashoutList,
  Cashout,
  CashoutDetail,
  XiaoluCoin,
} from 'containers/User';

import {
  OrderList,
  OrderDetail,
  Logistics,
  OrderCommit,
  OrderSuccess,
  OrderRedpacket,
  OrderSpellgroupProgress,
  OrderSpellgroupRule,
  OrderSelectCoupon,
} from 'containers/Order';

import {
  ProductDetails,
  ProductList,
  ProductAppDetails,
  ProductCategories,
  SearchProduct,
  SearchProductResult,
} from 'containers/Product';

import {
  RefundsApply,
  RefundsList,
  ExpressCompany,
  RefundsDetail,
  ExpressFind,
  ExpressFill,
} from 'containers/Refunds';

import {
  ComplainCommit,
  ComplainList,
} from 'containers/Complaint';

import {
  MamaHome,
  MamaCharge,
  MamaInvited,
  MamaOpeningFailed,
  MamaOpeningSucceed,
  MamaAgreement,
  MamaUniversityHome,
  MamaUniversityCourseDetail,
  MamaNotificationList,
  MamaNotificationDetail,
  MamaTeamIntroduce,
  MamaOpeningIntroduce,
  MamaBuyCoupon,
  TranCouponList,
  MamaEverydayPush,
  EliteMama,
  BoutiqueExchg,
  MamaTeamMember,
  MamaCommission,
  BoutiqueCoupon,
  ExchangeOrder,
  ReturnBoutiqueCoupon,
  ReturnProgress,
  BoutiqueInvite,
  BoutiqueInvite2,
  InOutCoupon,
  RecruitMama,
  Recharge,
  MamaRebate,
  EliteScoreLogList,
} from 'containers/Mama';

import {
  FavoriteList,
} from 'containers/Favorite';

import {
  JimayAgentRelShip,
  JimayOrderApply,
  JimayOrderList,
} from 'containers/Jimay';

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
    <Route path="/user/coin" component={XiaoluCoin} onEnter={utils.checkAuth} />
    <Route path="/user/coupons" component={CouponList} onEnter={utils.checkAuth} />
    <Route path="/user/wallet" component={CashoutList} onEnter={utils.checkAuth} />
    <Route path="/user/wallet/cashout" component={Cashout} onEnter={utils.checkAuth} />
    <Route path="/user/wallet/cashoutdetail/:index" component={CashoutDetail} />
    <Route path="/complaint/commit" component={ComplainCommit} onEnter={utils.checkAuth} />
    <Route path="/complaint/history" component={ComplainList} onEnter={utils.checkAuth} />
    <Route path="/ol.html" component={OrderList} onEnter={utils.checkAuth} />
    <Route path="/od.html" component={OrderDetail} onEnter={utils.checkAuth} />
    <Route path="/oc.html" component={OrderCommit} onEnter={utils.checkAuth} />
    <Route path="/order/success/:tradeId/:tid" component={OrderSuccess} onEnter={utils.checkAuth} />
    <Route path="/order/logistics" component={Logistics} onEnter={utils.checkAuth} />
    <Route path="/order/redpacket" component={OrderRedpacket} />
    <Route path="/order/spell/group/:sId" component={OrderSpellgroupProgress} />
    <Route path="/order/spell/rule" component={OrderSpellgroupRule} />
    <Route path="/order/selectcoupon" component={OrderSelectCoupon} />
    <Route path="/shop/bag" component={ShopBag} onEnter={utils.checkAuth} />
    <Route path="/product/details/:id" component={ProductDetails} />
    <Route path="/product/details/app/:id" component={ProductAppDetails} />
    <Route path="/product/list" component={ProductList} />
    <Route path="/product/categories" component={ProductCategories} />
    <Route path="/product/search" component={SearchProduct} />
    <Route path="faq" component={FaqCategory} />
    <Route path="faq/list/:id/:name" component={FaqList} />
    <Route path="/refunds/details/:refundsid" component={RefundsDetail} onEnter={utils.checkAuth} />
    <Route path="/refunds/express/fill/:refundsid/:orderid/:name" component={ExpressFill} onEnter={utils.checkAuth} />
    <Route path="/refunds/express/find" component={ExpressFind} onEnter={utils.checkAuth} />
    <Route path="/refunds/express/company/:refundsid/:orderid" component={ExpressCompany} onEnter={utils.checkAuth} />
    <Route path="/refunds" component={RefundsList} onEnter={utils.checkAuth} />
    <Route path="/refunds/apply/:tradeId/:orderId" component={RefundsApply} onEnter={utils.checkAuth} />
    <Route path="/alipay" component={Alipay} />
    <Route path="/mama/agreement" component={MamaAgreement} />
    <Route path="/mama/open/succeed" component={MamaOpeningSucceed} />
    <Route path="/mama/open/failed" component={MamaOpeningFailed} />
    <Route path="/mama/invited" component={MamaInvited} />
    <Route path="/boutiqueinvite" component={BoutiqueInvite} />
    <Route path="/boutiqueinvite2/:id" component={BoutiqueInvite2} />
    {activityRoutes}
    <Route path="/mama/home" component={MamaHome} onEnter={utils.checkAuth} />
    <Route path="/mama/university/home" component={MamaUniversityHome} />
    <Route path="/mama/university/course/detail" component={MamaUniversityCourseDetail} />
    <Route path="/mama/notification/list" component={MamaNotificationList} onEnter={utils.checkAuth} />
    <Route path="/mama/notification/detail" component={MamaNotificationDetail} onEnter={utils.checkAuth} />
    <Route path="/mama/team/introduce" component={MamaTeamIntroduce} />
    <Route path="/mama/open/introduce" component={MamaOpeningIntroduce} />
    <Route path="/buycoupon" component={MamaBuyCoupon} />
    <Route path="/trancoupon/list" component={TranCouponList} />
    <Route path="/mama/everydaypush" component={MamaEverydayPush} />
    <Route path="/mama/elitemama" component={EliteMama} />
    <Route path="/mama/boutique" component={BoutiqueExchg} />
    <Route path="/mama/teammember" component={MamaTeamMember} />
    <Route path="/mama/commission" component={MamaCommission} />
    <Route path="/mama/boutiquecoupon" component={BoutiqueCoupon} />
    <Route path="/mama/exchgorder" component={ExchangeOrder} />
    <Route path="/mama/returncoupon" component={ReturnBoutiqueCoupon} />
    <Route path="/mama/returncoupon/progress" component={ReturnProgress} />
    <Route path="/mama/inoutcoupon" component={InOutCoupon} />
    <Route path="/mama/recruit" component={RecruitMama} />
    <Route path="/recharge" component={Recharge} />
    <Route path="/mama/rebate" component={MamaRebate} />
    <Route path="/mama/scorelog" component={EliteScoreLogList} />
    <Route path="/favorite/list" component={FavoriteList} onEnter={utils.checkAuth} />
    <Route path="/jimay/order" component={JimayOrderList} onEnter={utils.checkJimayAuth} />
    <Route path="/jimay/order/create" component={JimayOrderApply} />
    <Route path="/jimay/agent" component={JimayAgentRelShip} />
    <Route status={404} path="*" component={Home} />
  </Route>
);
