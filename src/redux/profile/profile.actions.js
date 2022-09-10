import {
  deletePost,
  fetchPosts,
  getPostById,
  pinPost,
  toggleLikePost,
  unpinPost,
} from "../../utils/api/posts";
import {
  PROFILE_REQUEST_SENT,
  GET_POSTS,
  TOGGLE_LIKE_POST,
  GET_USER_LIKES,
  REFRESH_POST,
  GET_TWEETS_AND_REPLIES,
  REFRESH_FEED,
  FEED_REQUEST_SENT,
  GET_FEED_SUCCESS,
  GET_PINNED_POST,
  REMOVE_PINNED_POST,
  ADD_PINNED_POST,
  DELETE_POST,
  GET_PROFILE_SUCCESS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  EDIT_USER,
  GET_FOLLOWERS_SUCCESS,
  GET_FOLLOWING_SUCCESS,
  TOGGLE_LIKE_PIN_POST,
} from "./profile.types";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore/lite";
import { db } from "../../firebase/config";
import {
  followUser,
  getProfileFollowers,
  getProfileFollowing,
  getUserDetails,
  unfollowUser,
} from "../../utils/api/users";
import { handleProfileCreatedAt } from "../../utils/handlers";

const getProfile = (username) => async (dispatch) => {
  dispatch({
    type: PROFILE_REQUEST_SENT,
  });

  let profile = await getUserDetails(username);

  const createdAt = handleProfileCreatedAt(profile);

  profile = {
    ...profile,
    createdAt,
  };

  dispatch({
    type: GET_PROFILE_SUCCESS,
    payload: profile,
  });

  return profile;
};

const getPosts = (profileId) => async (dispatch) => {
  dispatch({
    type: FEED_REQUEST_SENT,
  });
  const postsRef = collection(db, `posts`);
  const postsQuery = query(
    postsRef,
    where("uid", "==", profileId),
    where("postType", "==", "tweet"),
    orderBy("timestamp", "desc")
  );
  const posts = await Promise.all(
    await (
      await getDocs(postsQuery)
    ).docs.map(async (doc) => ({
      id: doc.id,
      followers: await (
        await getDocs(collection(db, `users/${doc.data().uid}/followers`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      likes: await (
        await getDocs(collection(db, `posts/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...doc.data(),
    }))
  );

  dispatch({
    type: GET_FEED_SUCCESS,
    payload: posts,
  });

  return posts;
};

const refreshPost = (postId) => async (dispatch) => {
  const post = await getPostById(postId);

  dispatch({
    type: REFRESH_POST,
    payload: post,
  });
};

const getTweetsAndReplies = (profileId) => async (dispatch) => {
  dispatch({
    type: FEED_REQUEST_SENT,
  });
  const profileRef = doc(db, `users/${profileId}`);
  const filter = {
    where: ["userRef", "==", profileRef],
    orderBy: ["timestamp", "desc"],
  };

  const posts = await fetchPosts(filter);
  console.log("pas:", posts);

  dispatch({
    type: GET_FEED_SUCCESS,
    payload: posts,
  });
};

const getUsersLikedPosts = (profileId) => async (dispatch) => {
  dispatch({
    type: FEED_REQUEST_SENT,
  });
  const likesRef = collection(db, `users/${profileId}/likes`);
  const postIds = await getDocs(likesRef);

  const postDocs = await Promise.all(
    postIds.docs.map(async (post) => await getDoc(doc(db, `posts/${post.id}`)))
  );

  const posts = await Promise.all(
    postDocs.map(async (doc) => ({
      id: doc.id,
      followers: await (
        await getDocs(collection(db, `users/${doc.data().uid}/followers`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      likes: await (
        await getDocs(collection(db, `posts/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...doc.data(),
    }))
  );

  dispatch({
    type: GET_FEED_SUCCESS,
    payload: posts,
  });
};

const toggleLikeTweet = (postId) => async (dispatch) => {
  const likes = await toggleLikePost(postId);

  console.log("likes: ", likes);

  dispatch({
    type: TOGGLE_LIKE_POST,
    payload: {
      postId,
      likes,
    },
  });
};

const getPinnedPost = (postId) => async (dispatch) => {
  const post = await getPostById(postId);

  dispatch({
    type: GET_PINNED_POST,
    payload: post,
  });
};

const addPinnedPost = (postId, authId) => async (dispatch) => {
  const post = await pinPost(postId, authId);

  dispatch({
    type: ADD_PINNED_POST,
    payload: post,
  });
};

const toggleLikePinPost = (postId) => async (dispatch) => {
  const likes = await toggleLikePost(postId);

  dispatch({
    type: TOGGLE_LIKE_PIN_POST,
    payload: likes,
  });
};

const removePinnedPost = (postId, authId) => async (dispatch) => {
  await unpinPost(postId, authId);

  dispatch({
    type: REMOVE_PINNED_POST,
    payload: {},
  });
};

const deleteTweet = (postId, authId) => async (dispatch) => {
  const tweetId = await deletePost(postId, authId);

  dispatch({
    type: DELETE_POST,
    payload: tweetId,
  });
};

const followProfile = (profileId, authId) => async (dispatch, getState) => {
  const { following, followers } = await followUser(profileId, authId);
  console.log("Followers: ", followers);

  dispatch({
    type: FOLLOW_USER,
    payload: {
      following,
      followers,
    },
  });

  const profile = getState().profile.profile;

  console.log("PROFILE: ", profile);

  return profile;
};
const unfollowProfile = (profileId, authId) => async (dispatch, getState) => {
  console.log("AYOOO");

  const { followers, following } = await unfollowUser(profileId, authId);
  console.log("Followers: ", followers);
  dispatch({
    type: UNFOLLOW_USER,
    payload: {
      followers,
      following,
    },
  });
  const profile = getState().profile.profile;

  console.log("PROFILE: ", profile);

  return profile;
};

const editProfile = (data, profileId) => async (dispatch) => {
  dispatch({
    type: PROFILE_REQUEST_SENT,
  });

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

  const profileSnapshot = await getDoc(profileRef);

  const profile = { id: profileSnapshot.id, ...profileSnapshot.data() };
  const createdAt = handleProfileCreatedAt(profile);

  dispatch({
    type: EDIT_USER,
    payload: { ...profile, createdAt },
  });
};

const getFollowers = (profileId) => async (dispatch) => {
  dispatch({
    type: FEED_REQUEST_SENT,
  });
  let followers = await getProfileFollowers(profileId);

  dispatch({
    type: GET_FOLLOWING_SUCCESS,
    payload: followers,
  });

  return followers;
};

const getFollowing = (profileId) => async (dispatch) => {
  dispatch({
    type: FEED_REQUEST_SENT,
  });
  let following = await getProfileFollowing(profileId);

  dispatch({
    type: GET_FOLLOWING_SUCCESS,
    payload: following,
  });

  return following;
};

export {
  getProfile,
  getPosts,
  getUsersLikedPosts,
  getTweetsAndReplies,
  toggleLikeTweet,
  getPinnedPost,
  addPinnedPost,
  removePinnedPost,
  toggleLikePinPost,
  deleteTweet,
  followProfile,
  unfollowProfile,
  editProfile,
  refreshPost,
  getFollowers,
  getFollowing,
};
