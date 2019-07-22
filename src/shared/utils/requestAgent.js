import { store } from '../../store';
const request = require('superagent-use')(require('superagent'));

// const ENVIRONMENT = process.env.NODE_ENV;

request.use((req) => {
  const state = store.getState();
  const token = state.authentication.token;

  if (token) {
    req.header['x-access-token'] = token;
  }

  return req;
});

export default request;
