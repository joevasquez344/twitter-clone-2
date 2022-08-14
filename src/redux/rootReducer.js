import {combineReducers} from 'redux';
import usersReducer from './users/users.reducer';
import tweetsReducer from './tweets/tweets.reducer';
import tweetDetailsReducer from './tweet-details/tweet-details.reducer';
import homeReducer from './home/home.reducer';
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore

import {
    firebaseReducer
  } from 'react-redux-firebase'

const rootReducer = combineReducers({
    tweets: tweetsReducer,
    home: homeReducer,
    tweetDetails: tweetDetailsReducer,
    users: usersReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

export default rootReducer;