import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import {
  TopTen,
  A20160701,
  ExamHome,
  ExamQuestion,
  ExamResult,
  ShopOpening,
  ShopAgreement,
  ShopOpeningSucceed,
  ShopInvited,
  SummerMatHome,
  SummerMatSuccess,
  SummerMatRegistration,
  ShopOpeningFailed,
} from 'containers/Activity';
// /mall/activity/shop/charge

export default (
  <Route>
    <Route path="/activity/20160701" component={A20160701} />
    <Route path="/activity/topTen" component={TopTen} />
    <Route path="/activity/exam" component={ExamHome} onEnter={utils.checkAuth} />
    <Route path="/activity/exam/question/:type/:id" component={ExamQuestion} onEnter={utils.checkAuth} />
    <Route path="/activity/exam/result" component={ExamResult} onEnter={utils.checkAuth} />
    <Route path="/activity/shop/open" component={ShopOpening} />
    <Route path="/activity/shop/agreement" component={ShopAgreement} />
    <Route path="/activity/shop/open/succeed" component={ShopOpeningSucceed} />
    <Route path="/activity/shop/open/failed" component={ShopOpeningFailed} />
    <Route path="/activity/shop/invited" component={ShopInvited} />
    <Route path="/activity/summer/mat/home" component={SummerMatHome} />
    <Route path="/activity/summer/mat/success" component={SummerMatSuccess} />
    <Route path="/activity/summer/mat/register" component={SummerMatRegistration} />
  </Route>
);
