import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import { TopTen, A20160606, ExamHome, ExamQuestion } from 'containers/Activity';

export default (
  <Route>
    <Route path="/activity/top10" component={TopTen} />
    <Route path="/activity/20160606" component={A20160606} />
    <Route path="/activity/exam" component={ExamHome} onEnter={utils.checkAuth} />
    <Route path="/activity/exam/question" component={ExamQuestion} onEnter={utils.checkAuth} />
  </Route>
);
