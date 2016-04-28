import _ from 'underscore';

export const productSuccessReducer = (state, actionData) => {
  const payload = actionData;
  if (state.data.when === actionData.when) {
    payload.results = _.chain(state.data.results || []).union(actionData.results || []).unique('id').value();
  }
  return _.extend({}, state, { isLoading: false, data: payload, error: false, success: true });
};
