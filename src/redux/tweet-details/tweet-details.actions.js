import { db } from "../../firebase/config";
import { collection, getDocs, query } from "firebase/firestore/lite";
import {
  serverTimestamp,
  setDoc,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  limit,
  where,
  getDoc,
  getDocFromServer,
} from "firebase/firestore";

import {
  LIKE_TWEET_DETAILS,
  LIKE_COMMENT,
  GET_COMMENTS,
  TWEET_DETAILS_SUCCESS,
  TWEET_DETAILS_REQUEST,
  LIKE_REPLIED_TO_POST,
} from "./tweet-details.types";

import { getPostById, getPostLikes, toggleLikePost } from "../../utils/api/posts";

const getPostDetails = (postId) => async (dispatch) => {
  dispatch({
    type: TWEET_DETAILS_REQUEST,
  });
  const post = await getPostById(postId);

  dispatch({
    type: TWEET_DETAILS_SUCCESS,
    payload: post,
  });

  return post;
};

const fetchComments = (postId, postType) => async (dispatch) => {
  const postsRef = collection(db, "posts");
  const postRef = doc(db, `posts/${postId}`)

  const commentsQuery = query(postsRef, where("replyTo", "==", postRef), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(commentsQuery);

  const comments = await Promise.all(
    snapshot.docs.map(async (doc) => ({
      id: doc.id,
      likes: await (
        await getDocs(collection(db, `posts/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      ...doc.data(),
    }))
  );

  dispatch({
    type: GET_COMMENTS,
    payload: comments,
  });
};

const likeRepliedToPost = (postId) => async dispatch => {
  const likes = await toggleLikePost(postId)

  dispatch({
    type: LIKE_REPLIED_TO_POST,
    payload: {
      likes,
      postId
    }
  })
}


const likePostDetails = (tweetId) => async (dispatch) => {
 await toggleLikePost(tweetId);

 const likes = await getPostLikes(tweetId)
  dispatch({
    type: LIKE_TWEET_DETAILS,
    payload: {
      id: tweetId,
      likes,
    },
  });

  return likes;
};

const likeComment = (id) => async (dispatch) => {
  const likes = await toggleLikePost(id);

  dispatch({
    type: LIKE_COMMENT,
    payload: {
      likes,
      tweetId: id,
    },
  });
};


export {
  likePostDetails,
  fetchComments,
  likeComment,
  getPostDetails,
  likeRepliedToPost
};
