import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
  getDoc,
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
import { ADD_BOOKMARK } from "../bookmarks/bookmarks.actions";
import { DELETE_POST } from "../profile/profile.types";
import {
  CREATE_BOOKMARK,
  DELETE_BOOKMARK,
  FOLLOW_USER,
  GET_POSTS,
  PIN_POST,
  REFRESH_POST,
  TOGGLE_FOLLOW_USER,
  TOGGLE_LIKE_POST,
  UNFOLLOW_USER,
  UNPIN_POST,
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
        type: UNFOLLOW_USER,
        payload: {
          followers,
          postId: post.id,
        },
      });
    } else {
      const { followers } = await followUser(post.uid, authId);

      dispatch({
        type: FOLLOW_USER,
        payload: {
          followers,
          postId: post.id,
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
export {
  getPosts,
  likePost,
  refreshPost,
  deletePost,
  toggleFollowPostUser,
  addBookmark,
  removeBookmark,
  pinTweet,
  unpinTweet,
};
