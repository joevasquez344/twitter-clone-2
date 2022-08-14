import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {Provider} from 'react-redux';
import {createStore} from "./redux/store";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";

import {
  ReactReduxFirebaseProvider,
} from 'react-redux-firebase'
import {rrfProps} from './redux/store'

const root = ReactDOM.createRoot(document.getElementById("root"));


const store = createStore();
root.render(
<Provider store={store}>
 <ReactReduxFirebaseProvider {...rrfProps}>
 <Router>
    <App />
  </Router>
 </ReactReduxFirebaseProvider>
</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
