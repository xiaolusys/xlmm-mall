import axios from 'axios';
import * as constants from 'constants';

export default function checkAuth(nextState, replace, next) {
  axios.get(constants.baseEndpointV1 + 'users/islogin')
    .then((resp) => {
      next();
    })
    .catch((resp) => {
      replace(`/user/login?next=${nextState.location.pathname}`);
      next();
    });

}
