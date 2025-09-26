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


import {
 
} from "./explore.types";

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
