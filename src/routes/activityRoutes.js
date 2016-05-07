import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import { Md20160508 } from 'containers/Activity';

export default (
  <Route path="/activity/20160508" component={Md20160508} onEnter={utils.checkAuth}/>
);
