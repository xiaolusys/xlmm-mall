import React from 'react';
import { Route, IndexRoute } from 'react-router';
import * as utils from 'utils';

import { TopTen } from 'containers/Activity';

export default (
  <Route path="/activity/top10" component={TopTen}/>
);
