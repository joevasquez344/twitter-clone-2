import {
  LOAD_USER,
  LOGIN,
  LOGOUT,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  REGISTER_FAILED,
  REGISTER_SUCCESS,
  USER_DETAILS_REQUEST,
  GET_USER_DETAILS,
  GET_USER_TWEETS,
  GET_USER_TWEETS_AND_REPLIES,
  GET_USER_LIKES,
  FOLLOW_USER,
  UNFOLLOW_USER,
  LIKE_TWEET,
  EDIT_PROFILE,
  PIN_TWEET,
  UNPIN_TWEET,
  GET_AUTHS_PINNED_TWEET,
  SHOW_HOME_SUGGESTIONS,
} from "./users.types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
  updateProfile,
} from "firebase/auth";

import { db } from "../../firebase/config";
import { writeBatch } from "firebase/firestore/lite";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  followUser,
  getFollowers,
  getProfileFollowing,
  getUserDetails,
  unfollowUser,
} from "../../utils/api/users";
import {
  toggleLikePost,
  pinPost,
  unpinPost,
  getPostById,
} from "../../utils/api/posts";
import { handleProfileCreatedAt } from "../../utils/handlers";

const getAuthUser = (authUser) => async (dispatch) => {
  const userRef = doc(db, "users", authUser);

  const user = await getDoc(userRef);

  dispatch({
    type: LOAD_USER,
    payload: {
      id: user.id,
      ...user.data(),
    },
  });
};

const login = (email, password) => (dispatch) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      // dispatch({
      //   type: LOGIN_SUCCESS,
      //   payload: {
      //     id: userCredentials.user.uid,
      //     email: userCredentials.user.email,
      //   },
      // });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // dispatch({
      //   type: LOGIN_FAILED,
      //   payload: errorMessage
      // })
    });
};

const logout = () => (dispatch) => {
  const auth = getAuth();
  signOut(auth);
  dispatch({
    type: LOGOUT,
    payload: null,
  });
};

const register = (data) => (dispatch) => {
  const { email, password, username, name, bio, birthday, location } = data;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      setDoc(doc(db, "users", userCredentials.user.uid), {
        id: userCredentials.user.uid,
        email: userCredentials.user.email,
        name,
        likes: [],
        username,
        birthday,
        bio,
        location,
        avatar: null,
        banner: null,
        pinnedPost: {},
        createdAt: userCredentials.user.metadata.creationTime,
        theme: "light",
        homeSuggestions: "open",
      })
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });

      updateProfile(auth.currentUser, {
        displayName: name,
        username,
        birthday,
        bio,
      })
        .then((user) => {})
        .catch((error) => {
          console.log(error);
        });

      // dispatch({
      //   type: REGISTER_SUCCESS,
      //   payload: {
      //     id: userCredentials.user.uid,
      //     email: userCredentials.user.email
      //   },
      // });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // dispatch({
      //   type: REGISTER_FAILED,
      //   payload: errorMessage
      // })
    });
};

const getProfile = (username) => async (dispatch) => {
  dispatch({
    type: USER_DETAILS_REQUEST,
  });
  const user = await getUserDetails(username);
  const followers = await getFollowers(user);
  const following = await getProfileFollowing(user);

  const createdAt = handleProfileCreatedAt(user);

  const profile = {
    ...user,
    following,
    followers,
    createdAt,
  };

  dispatch({
    type: GET_USER_DETAILS,
    payload: profile,
  });

  return profile;
};

const likeTweet = (tweetId, postType) => async (dispatch) => {
  const likes = await toggleLikePost(tweetId);

  dispatch({
    type: LIKE_TWEET,
    payload: likes,
  });
};

const loadAuthsPinnedTweet = (postId) => async (dispatch) => {
  let post = await getPostById(postId);

  dispatch({
    type: GET_AUTHS_PINNED_TWEET,
    payload: post,
  });
};

const pinTweet = (post, authId) => async (dispatch) => {
  await pinPost(post.id, authId);
  dispatch({
    type: PIN_TWEET,
    payload: post,
  });
};

const unpinTweet = (post, authId) => async (dispatch) => {
  await unpinPost(post.id, authId);
  dispatch({
    type: UNPIN_TWEET,
  });
};

const followProfile = (profileId, authId) => async (dispatch, getState) => {
  const { following, followers } = await followUser(profileId, authId);

  dispatch({
    type: FOLLOW_USER,
    payload: {
      following,
      followers,
    },
  });

  const profile = getState().users.userDetails;

  return profile;
};
const unfollowProfile = (profileId, authId) => async (dispatch, getState) => {
  const { followers, following } = await unfollowUser(profileId, authId);

  dispatch({
    type: UNFOLLOW_USER,
    payload: {
      followers,
      following,
    },
  });
  const profile = getState().users.userDetails;

  return profile;
};

const editProfile = (data, profileId) => async (dispatch) => {
  const { bio, location, name, birthday } = data;

  const profileRef = doc(db, `users/${profileId}`);

  const batch = writeBatch(db);

  batch.update(profileRef, {
    bio: bio,
    location: location,
    name: name,
    birthday: birthday,
  });

  await batch.commit();

  const updatedProfile = await (await getDoc(profileRef)).data();
  const createdAt = handleProfileCreatedAt(updatedProfile);

  dispatch({
    type: EDIT_PROFILE,
    payload: { ...updatedProfile, createdAt },
  });
};


export {
  login,
  register,
  logout,
  getAuthUser,
  getProfile,
  followProfile,
  unfollowProfile,
  likeTweet,
  editProfile,
  pinTweet,
  unpinTweet,
  loadAuthsPinnedTweet,
};
