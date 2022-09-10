import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore/lite";
import { db } from "../../firebase/config";
import { fetchPosts, getPostById, toggleLikePost } from "../../utils/api/posts";
import { GET_POSTS, REFRESH_POST, TOGGLE_LIKE_POST } from "./home.types";

const getPosts = (query) => async (dispatch) => {
  const posts = await fetchPosts(query);

  dispatch({
    type: GET_POSTS,
    payload: posts,
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

export { getPosts, likePost, refreshPost };
