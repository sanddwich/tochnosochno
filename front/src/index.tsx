import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import store from './Redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import { Provider } from 'react-redux'

let persistor = persistStore(store)
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
