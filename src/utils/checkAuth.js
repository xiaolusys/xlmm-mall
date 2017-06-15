import axios from 'axios';
import * as constants from 'constants';
import * as ui from './ui';
import qs from 'qs';

export function checkAuth(nextState, replace, next) {
  ui.loadingSpinner.show();
  axios.get(constants.baseEndpointV1 + 'users/islogin')
    .then((resp) => {
      ui.loadingSpinner.hide();
      next();
    })
    .catch((resp) => {
      ui.loadingSpinner.hide();
      if (resp.status === 403) {
        replace(`/user/login?next=${encodeURIComponent(nextState.location.pathname + nextState.location.search)}`);
      }
      next();
    });
}

export function checkJimayAuth(nextState, replace, next) {
  ui.loadingSpinner.show();
  axios.get(constants.baseEndpointV1 + 'users/islogin?extras=1')
    .then((resp) => {
      ui.loadingSpinner.hide();
      if (resp.data.extras && !resp.data.extras.valid_mobile) {
        replace(`/user/profile/phone?next=${encodeURIComponent(nextState.location.pathname + nextState.location.search)}`);
        console.log('replaced');
      }
      next();
    })
    .catch((resp) => {
      ui.loadingSpinner.hide();
      if (resp.status === 403) {
        replace(constants.baseEndpoint + `jimay/weixin_login/?next=${encodeURIComponent(nextState.location.pathname + nextState.location.search)}`);
      }
      next();
    });
}
