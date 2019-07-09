import { combineReducers } from 'redux'
import video from './video';
import authentication from './authentication';
import organization from './organization';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    // state: (state = {}) => state,
    video,
    authentication,
    organization
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
