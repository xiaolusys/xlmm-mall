import axios from 'axios';
import * as constants from 'constants';
import * as ui from './ui';

export default function checkAuth(nextState, replace, next) {
  console.log('☁️ ☀️ ☁️️☁️');
  console.log('🌴🌴🌴 ' + ' 🎈🎈');
  console.log('️🌴🌴🌴🌴' + ' 🎈');
  console.log('🌴🌴🌴🌴🌴🌴');
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
