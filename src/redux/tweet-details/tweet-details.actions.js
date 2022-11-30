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
  COMMENTS_REQUEST_SENT,
  GET_COMMENTS_SUCCESS,
  TWEET_DETAILS_SUCCESS,
  TWEET_DETAILS_REQUEST,
  LIKE_REPLIED_TO_POST,
  DELETE_COMMENT,
  UNFOLLOW_USER,
  FOLLOW_USER,
  REFRESH_POST,
  DELETE_REPLIED_TO_POST,
  GET_THREAD_POSTS,
  DELETE_POST,
  TWEET_DETAILS_FAILED,
} from "./tweet-details.types";

import {
  deletePostById,
  getBookmarks,
  getComments,
  getPostById,
  getPostLikes,
  getPostsByThreadId,
  toggleLikePost,
} from "../../utils/api/posts";
import {
  followUser,
  getUserDetails,
  unfollowUser,
} from "../../utils/api/users";

const getPostDetails = (postId) => async (dispatch) => {
  dispatch({
    type: TWEET_DETAILS_REQUEST,
  });
  const postDetails = await getPostById(postId);
  console.log('Details: ', postDetails)

  let { posts, deletedPostIds } = await getPostsByThreadId(postDetails.id);

  if (!postDetails.uid) {
    postDetails.deleted = true;
  } else {
    postDetails.deleted = false;
  }

  postDetails.replyToPostDeleted = false;
  posts = await Promise.all(
    posts.map(async (post) => {
      post.replyToPostDeleted = false;

      deletedPostIds.forEach((id) => {
        if (post.replyTo.id === id) post.replyToPostDeleted = true;
        if (postDetails.replyTo?.id === id)
          postDetails.replyToPostDeleted = true;
      });

      return {
        ...post,
        replyToUsers: await getPostsByThreadId(post.id),
      };
    })
  );

  posts = posts.map((post) => ({
    ...post,
    replyToUsers: post.replyToUsers.posts,
  }));

  dispatch({
    type: TWEET_DETAILS_SUCCESS,
    payload: { postDetails, posts, deletedPostIds },
  });

  return postDetails;
};

const fetchComments = (postId) => async (dispatch, getState) => {
  dispatch({
    type: COMMENTS_REQUEST_SENT,
  });
  const postsRef = collection(db, "posts");
  const postRef = doc(db, `posts/${postId}`);

  const user = getState().users.user;

  const authUser = await getUserDetails(user.username);

  const commentsQuery = query(
    postsRef,
    where("replyTo", "==", postRef),
    orderBy("timestamp", "desc")
  );
  const snapshot = await getDocs(commentsQuery);

  let comments = await Promise.all(
    snapshot.docs.map(async (doc) => ({
      id: doc.id,

      likes: await (
        await getDocs(collection(db, `posts/${doc.id}/likes`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      comments: await getComments(doc.id),
      followers: await (
        await getDocs(collection(db, `users/${doc.data().uid}/followers`))
      ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      replyToUsers: await getPostsByThreadId({ id: doc.id, ...doc.data() }),
      bookmarks: await getBookmarks(doc.data().uid),

      ...doc.data(),
    }))
  );

  comments = comments.map((post) => {
    if(post.uid) {
      post.deleted = false
    } else {
      post.deleted = true
    }
    if (post.uid === authUser.id) {
      if (authUser.pinnedPost.id && post.id === authUser.pinnedPost?.id) {
        post.pinnedPost = true;
      } else {
        post.pinnedPost = false;
      }
    }

    return {
      ...post,
      replyToUsers: post.replyToUsers.posts,
    };
  });

  dispatch({
    type: GET_COMMENTS_SUCCESS,
    payload: comments,
  });
};

const likeRepliedToPost = (postId) => async (dispatch) => {
  const likes = await toggleLikePost(postId);

  dispatch({
    type: LIKE_REPLIED_TO_POST,
    payload: {
      likes,
      postId,
    },
  });
};

const likePostDetails = (tweetId) => async (dispatch) => {
  const likes = await toggleLikePost(tweetId);

  // const likes = await getPostLikes(tweetId);
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

const deletePost = (postId, authId) => async (dispatch, getState) => {
  const id = await deletePostById(postId, authId);

  const commentsFeed = getState().tweetDetails.comments;
  const tweetDetails = getState().tweetDetails.post;
  const repliedToPosts = getState().tweetDetails.repliedToPosts;

  const commentsMatch = commentsFeed.find((comment) => comment.id === id);
  const tweetDetailsMatch = tweetDetails.id === id;
  const repliedToPostsMatch = repliedToPosts.find((post) => post.id === id);

  if (commentsMatch) {
    dispatch({
      type: DELETE_COMMENT,
      payload: id,
    });
  }

  if (tweetDetailsMatch) {
    dispatch({
      type: DELETE_POST,
      payload: null,
    });
  }

  if (repliedToPostsMatch) {
    dispatch({
      type: DELETE_REPLIED_TO_POST,
      payload: id,
    });
  }
};

const toggleFollowPostUser = (post, authId) => async (dispatch, getState) => {
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

const refreshPost = (postId) => async (dispatch) => {
  const post = await getPostById(postId);

  dispatch({
    type: REFRESH_POST,
    payload: post,
  });
};

const getThreadPosts = (postId) => async (dispatch, getState) => {
  const { posts, deletedPostIds } = await getPostsByThreadId(postId);

  const post = getState().tweetDetails.post;

  dispatch({
    type: GET_THREAD_POSTS,
    payload: {
      posts: posts.filter((tweet) => tweet.id !== post.id),
      deletedPostIds,
    },
  });
};

export {
  likePostDetails,
  fetchComments,
  likeComment,
  getPostDetails,
  likeRepliedToPost,
  refreshPost,
  toggleFollowPostUser,
  deletePost,
  getThreadPosts,
};
