import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import {
  TopTenModel2,
  ExamHome,
  ExamQuestion,
  ExamResult,
  SummerMatHome,
  SummerMatSuccess,
  SummerMatRegistration,
  EntrepreneurshipRank,
  EntrepreneurshipIntroduce,
  EntrepreneurshipWinners,
} from 'containers/Activity';

export default (
  <Route>
    <Route path="/activity/topTen/model/2" component={TopTenModel2} />
    <Route path="/activity/exam" component={ExamHome} onEnter={utils.checkAuth} />
    <Route path="/activity/exam/question/:type/:id" component={ExamQuestion} onEnter={utils.checkAuth} />
    <Route path="/activity/exam/result" component={ExamResult} onEnter={utils.checkAuth} />
    <Route path="/activity/summer/mat/home" component={SummerMatHome} onEnter={utils.checkAuth}/>
    <Route path="/activity/summer/mat/success" component={SummerMatSuccess} />
    <Route path="/activity/summer/mat/register" component={SummerMatRegistration} />
    <Route path="/activity/20160729/rank" component={EntrepreneurshipRank} />
    <Route path="/activity/20160729/introduce" component={EntrepreneurshipIntroduce} />
    <Route path="/activity/20160729/winner/list" component={EntrepreneurshipWinners} />
  </Route>
);
