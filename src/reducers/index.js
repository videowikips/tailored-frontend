import { combineReducers } from 'redux'
import video from './video';
import article from './article';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    // state: (state = {}) => state,
    video,
    article,
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
