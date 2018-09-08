import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/css/material-dashboard-react.css?v=1.4.1";

import indexRoutes from "routes/index.jsx";
import Login from "views/Login/Login.jsx";

import { Provider } from "react-redux";
import { createStore, combineReducers, compose } from "redux";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import firebase from "firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore"; // <- needed if using firestore
import "firebase/firestore"; // <- needed if using firestore
// import 'firebase/functions' // <- needed if using httpsCallable

import { connect } from "react-redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { Redirect } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCoQw641BRZpmyeDQ-wkHU2o9tJbwKBbKk",
  projectId: "rooms-9c314",
  authDomain: "rooms-9c314.firebaseapp.com"
  // databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  // storageBucket: "<BUCKET>.appspot.com",
  // messagingSenderId: "<SENDER_ID>"
};

// react-redux-firebase config
const rrfConfig = {
  // userProfile: "users",
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// Initialize firebase instance
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer // <- needed if using firestore
});

// Create store with reducers and initial state
const initialState = {};
const store = createStoreWithFirebase(rootReducer, initialState);

const hist = createBrowserHistory();

const PrivateRoute = compose(
  firestoreConnect(), // withFirebase can also be used
  connect(({ firebase: { auth } }) => ({ auth }))
)(({ auth, component: Component, ...rest }) => (
  <Route
    {...rest}
    component={props =>
      isLoaded(auth) && !isEmpty(auth) ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
));

ReactDOM.render(
  <Provider store={store}>
    <Router history={hist}>
      <Switch>
        <Route path="/login" component={Login} />

        {indexRoutes.map((prop, key) => {
          return (
            <PrivateRoute
              path={prop.path}
              component={prop.component}
              key={key}
            />
          );
        })}
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
