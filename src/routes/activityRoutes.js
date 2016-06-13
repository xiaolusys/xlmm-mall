import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import { A20160615, A20160606 } from 'containers/Activity';

export default (
  <Route>
    <Route path="/activity/20160615" component={A20160615}/>
    <Route path="/activity/20160606" component={A20160606}/>
  </Route>
);
