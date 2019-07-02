import { combineReducers } from 'redux'
import video from './video';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    // state: (state = {}) => state,
    video,
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
