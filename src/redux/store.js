import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './rootReducer';
import {firebase, rrfConfig} from '../firebase/config'
import { composeWithDevTools } from 'redux-devtools-extension';
import {applyMiddleware} from 'redux'
import { createFirestoreInstance } from 'redux-firestore' // <- needed if using firestore

import thunk from 'redux-thunk';

const middleware = [thunk];


const createStore = (initialState) => {
    return configureStore({reducer: rootReducer, middleware, preloadedState: initialState})
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: createStore().dispatch,
  createFirestoreInstance // <- needed if using firestore
}


export {createStore, rrfProps};