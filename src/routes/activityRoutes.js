import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import { A20160615, A20160606, ExamHome, ExamQuestion } from 'containers/Activity';

export default (
  <Route>
    <Route path="/activity/20160615" component={A20160615}/>
    <Route path="/activity/20160606" component={A20160606} />
    <Route path="/activity/exam" component={ExamHome} onEnter={utils.checkAuth} />
    <Route path="/activity/exam/question/:type/:id" component={ExamQuestion} onEnter={utils.checkAuth} />
  </Route>
);
