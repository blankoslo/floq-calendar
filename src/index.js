import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import 'rxjs';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import './index.css';
import App from './containers/App';
import rootEpic from './epics';
import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware(rootEpic);

let store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(epicMiddleware)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
