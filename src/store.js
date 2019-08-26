import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import reduxThunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { reducer as batchReduxUpdatesReducer, reducerBatchUpdatesEnhancer } from  'redux-actions-bulk-batch';


import createRootReducer from './reducers'


function configureStore(rootReducer, initialState, middlewares = {}) {
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = createStore(
    persistReducer(persistConfig, persistedReducer),
    initialState,
    composeEnhancers(middlewares),
  )
  const persistor = persistStore(store)

  return { store, persistor }
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authentication', 'organization']
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const history = createBrowserHistory();

const middlewares = process.env.NODE_ENV === 'development'
  ? applyMiddleware(reduxThunk, routerMiddleware(history), createLogger())
  : applyMiddleware(reduxThunk, routerMiddleware(history))

    
const rootReducer = reducerBatchUpdatesEnhancer(createRootReducer({ router: connectRouter(history), batchReduxUpdates: batchReduxUpdatesReducer }))

const { store, persistor } = configureStore(rootReducer, {}, middlewares)

export {
  store,
  persistor,
  history,
}
