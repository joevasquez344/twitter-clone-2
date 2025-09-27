import {combineReducers} from 'redux';
import usersReducer from './users/users.reducer';
import profileReducer from './profile/profile.reducer'
import tweetsReducer from './tweets/tweets.reducer';
import tweetDetailsReducer from './tweet-details/tweet-details.reducer';
import homeReducer from './home/home.reducer';
import { firestoreReducer } from 'redux-firestore' // <- needed if using firestore

import {
    firebaseReducer
  } from 'react-redux-firebase'
import themeReducer from './theme/theme.reducer';
import exploreReducer from './explore/explore.reducer';
import bookmarksReducer from './bookmarks/bookmarks.reducer';

const rootReducer = combineReducers({
    tweets: tweetsReducer,
    home: homeReducer,
    tweetDetails: tweetDetailsReducer,
    users: usersReducer,
    profile: profileReducer,
    explore:exploreReducer,
    bookmarks: bookmarksReducer,
    theme: themeReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

export default rootReducer;