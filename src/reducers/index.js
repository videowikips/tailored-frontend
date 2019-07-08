import { combineReducers } from 'redux'
import video from './video';
import authentication from './authentication';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    // state: (state = {}) => state,
    video,
    authentication
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
