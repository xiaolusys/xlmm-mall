import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import { TopTen, A20160520 } from 'containers/Activity';

export default (
  <Route>
    <Route path="/activity/top10" component={TopTen}/>
    <Route path="/activity/20160520" component={A20160520}/>
  </Route>
);
