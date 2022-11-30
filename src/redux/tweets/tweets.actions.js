import {
  GET_TWEETS,
  CREATE_TWEET,
  LIKE_TWEET,
  UNLIKE_TWEET,
  GET_TWEET_DETAILS,
  UNLIKE_COMMENT,
  LIKE_COMMENT,
  GET_TWEET_COMMENTS,
  GET_BOOKMARKS,
} from "./tweets.types";
import { db } from "../../firebase/config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { fetchTweets, toggleLikeTweet } from "../../utils/api/tweets";
import {
  fetchMediaPosts,
  fetchPosts,
  getBookmarks,
  getComments,
  getPostsByThreadId,
} from "../../utils/api/posts";
import { getUserDetails } from "../../utils/api/users";

export const getTweets = () => async (dispatch) => {
  const query = {
    where: ["postType", "==", "tweet"],
    orderBy: ["timestamp", "desc"],
  };

  const posts = await fetchPosts(query);

  dispatch({
    type: GET_TWEETS,
    payload: posts,
  });
};

export const getProfileTweets = (profileId) => async (dispatch) => {
  const postsRef = collection(db, `posts`);
  const postsQuery = query(
    postsRef,
    where("uid", "==", profileId),
    where("postType", "==", "tweet"),
    orderBy("timestamp", "desc")
  );
  let posts = await Promise.all(
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
      comments: await getComments(doc.id),
      replyToUsers: await getPostsByThreadId({ id: doc.id, ...doc.data() }),

      ...doc.data(),
    }))
  );

  posts = posts.map((post) => ({
    ...post,
    replyToUsers: post.replyToUsers.posts,
  }));
  
};
export const getProfileTweetsAndReplies = (profileId) => async (dispatch) => {
  const profileRef = doc(db, `users/${profileId}`);
  const filter = {
    where: ["userRef", "==", profileRef],
    orderBy: ["timestamp", "desc"],
  };

  const posts = await fetchPosts(filter);
};

export const getProfileMediaTweets = (profileId) => async (dispatch) => {
  const posts = await fetchMediaPosts(profileId);
};
export const getProfileLikedTweets = (profileId) => async (dispatch) => {
  const likesRef = collection(db, `users/${profileId}/likes`);
  const postIds = await getDocs(likesRef);

  const postDocs = await Promise.all(
    postIds.docs.map(async (post) => await getDoc(doc(db, `posts/${post.id}`)))
  );

  const posts = await Promise.all(
    postDocs
      .filter((post) => post._document !== null)
      .map(async (doc) => ({
        id: doc.id,
        followers: await (
          await getDocs(collection(db, `users/${doc.data().uid}/followers`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...doc.data(),
        comments: await getComments(doc.id),
      }))
  );
};

export const getPostComments = (postId) => async (dispatch, getState) => {
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

      ...doc.data(),
    }))
  );

  comments = comments.map((post) => {
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
    type: GET_TWEET_COMMENTS,
    payload: comments,
  });
};

export const fetchBookmarks = (user) => async (dispatch) => {
  let bookmarks = await getBookmarks(user.id);

  dispatch({
    type: GET_BOOKMARKS,
    payload: bookmarks,
  });
};

export const getPostReplyTos = () => async (dispatch) => {};

export const likeTweet = (tweetId) => async (dispatch) => {
  const likes = await toggleLikeTweet(tweetId);

  dispatch({
    type: LIKE_TWEET,
    payload: {
      tweetId,
      likes,
    },
  });
};
