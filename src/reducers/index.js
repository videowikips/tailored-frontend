import { combineReducers } from 'redux'

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    state: (state = {}) => state,
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
