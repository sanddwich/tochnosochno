import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

import storage from 'localforage'
import createEncryptor from 'redux-persist-transform-encrypt'
import { persistReducer } from 'redux-persist'
import { AppState, AuthState } from './interfaces/interfaces'
import { initialOrderState, initialAuthState, initialAppState } from './constants/initialState'

const expireReducer = require('redux-persist-expire')

const encryptor = createEncryptor({
  secretKey:
    'u5cgB9hNvm1hJGZmbdJWAOHsny8LZUODZ5WjTuhshLQGBt43xmC6f03hymBXsX0dbT4qkDwvzxeczXD1ianuEcb21MarwXOwy3CPp4jNxtlvMlqr20FTFezk',
  onError: function (error: any) {
    console.log(error)
  },
})

const persistConfig: any = {
  key: 'tochnosochno',
  storage,
  blacklist: ['menu'],
  transforms: [
    expireReducer('order', {
      persistedAtKey: 'order__persisted_at',
      expireSeconds: 1 * 60 * 60,
      expiredState: initialOrderState,
      autoExpire: true,
    }),
    expireReducer('auth', {
      persistedAtKey: 'auth__persisted_at',
      expireSeconds: 3 * 60 * 60 * 24,
      expiredState: initialAuthState,
      autoExpire: true,
    }),
    expireReducer('app', {
      persistedAtKey: 'app__persisted_at',
      expireSeconds: 1 * 60 * 60,
      expiredState: initialAppState,
      autoExpire: true,
    }),
    encryptor,
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export type RootState = ReturnType<typeof rootReducer>

// let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))
let store = createStore(persistedReducer, applyMiddleware(thunk))

export default store
