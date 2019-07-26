import { combineReducers } from 'redux'
import video from './video';
import article from './article';
import authentication from './authentication';
import organization from './organization';
import translation from './translation';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    // state: (state = {}) => state,
    video,
    article,
    authentication,
    organization,
    translation,
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
