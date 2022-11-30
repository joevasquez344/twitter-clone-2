import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { createStore } from "./redux/store";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";

import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { rrfProps } from "./redux/store";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

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
