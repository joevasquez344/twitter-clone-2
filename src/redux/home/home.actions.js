import {
  collection,
  doc,
  getDocs,
  addDoc,
  orderBy,
  query,
  where,
  writeBatch,
  getDoc,
  serverTimestamp,
} from "firebase/firestore/lite";
import { db } from "../../firebase/config";
import {
  fetchPosts,
  getComments,
  getPostById,
  toggleLikePost,
  deletePostById,
  getBookmarks,
  pinPost,
  unpinPost,
  addBookmarkById,
  deleteBookmarkById,
} from "../../utils/api/posts";
import {
  followUser,
  getProfileFollowing,
  getUserDetails,
  toggleFollow,
  unfollowUser,
} from "../../utils/api/users";

import { ADD_BOOKMARK } from "../bookmarks/bookmarks.types";
import { DELETE_POST } from "../profile/profile.types";
import {
  CREATE_BOOKMARK,
  CREATE_POST,
  DELETE_BOOKMARK,
  FOLLOW_TWEET_USER,
  GET_POSTS,
  PIN_POST,
  REFRESH_POST,
  TOGGLE_FOLLOW_USER,
  TOGGLE_LIKE_POST,
  UNFOLLOW_TWEET_USER,
  UNPIN_POST,
  UPDATE_POST_IN_FEED,
} from "./home.types";

const getPosts = () => async (dispatch, getState) => {
  const authId = getState().users.user.id;
  const query = {
    where: ["postType", "==", "tweet"],
    orderBy: ["timestamp", "desc"],
  };

  let posts = await fetchPosts(query, authId);

  dispatch({
    type: GET_POSTS,
    payload: posts,
  });

  return posts;
};

const updatePostInFeedAfterCommentCreation = (replyToId) => (dispatch) => {
  dispatch({
    type: UPDATE_POST_IN_FEED,
    payload: replyToId,
  });
};

const refreshPost = (postId) => async (dispatch) => {
  const post = await getPostById(postId);

  dispatch({
    type: REFRESH_POST,
    payload: post,
  });
};

const likePost = (postId) => async (dispatch) => {
  const likes = await toggleLikePost(postId);

  dispatch({
    type: TOGGLE_LIKE_POST,
    payload: {
      postId,
      likes,
    },
  });
};



const deletePost = (postId, authId) => async (dispatch) => {
  const id = await deletePostById(postId, authId);

  dispatch({
    type: DELETE_POST,
    payload: id,
  });
};

const toggleFollowPostUser = (post, authId) => async (dispatch) => {
  const followers = post.followers;

  const authUsersPost = post.uid === authId;

  if (!authUsersPost) {
    const authIsFollowing = followers.find((user) => user.id === authId);

    if (authIsFollowing) {
      const { followers } = await unfollowUser(post.uid, authId);

      dispatch({
        type: UNFOLLOW_TWEET_USER,
        payload: {
          followers,
          uid: post.uid,
        },
      });
    } else {
      const { followers } = await followUser(post.uid, authId);

      dispatch({
        type: FOLLOW_TWEET_USER,
        payload: {
          followers,
          uid: post.uid,
        },
      });
    }
  }
};

const toggleFollowUser = (profileId, authId, postId) => async (dispatch) => {
  const { following, followers } = await toggleFollow(profileId, authId);

  dispatch({
    type: TOGGLE_FOLLOW_USER,
    payload: {
      followers,
      postId,
    },
  });
};

const pinTweet = (postId, authId) => async (dispatch) => {
  const { id } = await pinPost(postId, authId);
  dispatch({
    type: PIN_POST,
    payload: id,
  });
};

const unpinTweet = (postId, authId) => async (dispatch) => {
  const { id } = await unpinPost(postId, authId);
  dispatch({
    type: UNPIN_POST,
    payload: id,
  });
};

const addBookmark = (postId, authId) => async (dispatch) => {
  const id = await addBookmarkById(postId, authId);

  dispatch({
    type: ADD_BOOKMARK,
    payload: id,
  });
};

const removeBookmark = (postId, authId) => async (dispatch) => {
  const id = await deleteBookmarkById(postId, authId);

  dispatch({
    type: DELETE_BOOKMARK,
    payload: id,
  });
};

const createTweet = (selectedImageUrl, input) => async (dispatch, getState) => {
  const authUser = getState().users.user;
  const postsRef = collection(db, `posts`);

  const postData = {
    uid: authUser.id,
    userRef: doc(db, `users/${authUser.id}`),
    name: authUser.name,
    email: authUser.email,
    username: authUser.username,
    message: input,
    media: selectedImageUrl ? selectedImageUrl : "",
    avatar: authUser.avatar,
    timestamp: serverTimestamp(),
    postType: "tweet",
    replyTo: doc(db, `posts/${null}`),
    pinnedPost: false,
    // replyToUsers: [],
  };

  const { id } = await addDoc(postsRef, postData);

  const post = await getPostById(id);

  console.log('Post: ', post);

  dispatch({
    type: CREATE_POST,
    payload: post,
  });
};
export {
  getPosts,
  likePost,
  refreshPost,
  deletePost,
  createTweet,
  toggleFollowPostUser,
  addBookmark,
  removeBookmark,
  pinTweet,
  unpinTweet,
  updatePostInFeedAfterCommentCreation,
};
