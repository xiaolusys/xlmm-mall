import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import { A20160625, A20160621, A20160628, ExamHome, ExamQuestion, ExamResult } from 'containers/Activity';

export default (
  <Route>
    <Route path="/activity/20160625" component={A20160625}/>
    <Route path="/activity/20160621" component={A20160621} />
    <Route path="/activity/20160628" component={A20160628} />
    <Route path="/activity/exam" component={ExamHome} onEnter={utils.checkAuth} />
    <Route path="/activity/exam/question/:type/:id" component={ExamQuestion} onEnter={utils.checkAuth} />
    <Route path="/activity/exam/result" component={ExamResult} onEnter={utils.checkAuth} />
  </Route>
);
