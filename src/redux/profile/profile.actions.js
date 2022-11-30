import {
  deletePostById,
  fetchProfileMediaPosts,
  fetchPosts,
  getComments,
  getPostById,
  getPostsByThreadId,
  pinPost,
  toggleLikePost,
  unpinPost,
  fetchProfileTweets,
  fetchProfileTweetsAndReplies,
  getUsersPostsCount,
  fetchPinnedPost,
  populatePost,
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
  FOLLOW_POST_USER,
  UNFOLLOW_POST_USER,
  GET_MEDIA_POSTS,
  GET_USERS_POST_COUNT,
  UPDATE_USERS_POST_COUNT,
  ADD_USERS_POST_COUNT,
  CREATE_COMMENT,
  TWEETS_REQUEST_SENT,
  GET_TWEETS_SUCCESS,
  GET_TWEETS_AND_REPLIES_SUCCESS,
  GET_MEDIA_SUCCESS,
  GET_LIKES_SUCCESS,
  SET_FEED_MESSAGE,
  CLEAR_FEED_MESSAGE,
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
import { auth, db } from "../../firebase/config";
import {
  followUser,
  getFollowers,
  getProfileFollowing,
  getUserDetails,
  unfollowUser,
} from "../../utils/api/users";
import { handleProfileCreatedAt } from "../../utils/handlers";
import { createComment } from "../../utils/api/comments";

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

const getPosts = (username) => async (dispatch, getState) => {
  const profile = getState().profile.profile;

  dispatch({
    type: FEED_REQUEST_SENT,
  });

  let posts = await fetchProfileTweets(username);

  if (posts.length === 0) {
    dispatch({
      type: SET_FEED_MESSAGE,
      payload: {
        header: `${profile.name} has not Tweeted yet`,
        subText: "",
      },
    });
  } else {
    dispatch({
      type: CLEAR_FEED_MESSAGE,
    });
  }

  dispatch({
    type: GET_TWEETS_SUCCESS,
    payload: {
      posts,
    },
  });

  return posts;
};

const getTweetsAndReplies = (username) => async (dispatch, getState) => {
  const profile = getState().profile.profile;

  dispatch({
    type: FEED_REQUEST_SENT,
  });

  const posts = await fetchProfileTweetsAndReplies(username);

  if (posts.length === 0) {
    dispatch({
      type: SET_FEED_MESSAGE,
      payload: {
        header: `${profile.name} has not Tweeted a Reply yet`,
        subText: "",
      },
    });
  } else {
    dispatch({
      type: CLEAR_FEED_MESSAGE,
    });
  }

  dispatch({
    type: GET_TWEETS_AND_REPLIES_SUCCESS,
    payload: {
      posts,
    },
  });
};

const getMediaPosts = (username) => async (dispatch, getState) => {
  const profile = getState().profile.profile;

  dispatch({
    type: FEED_REQUEST_SENT,
  });

  const posts = await fetchProfileMediaPosts(username);

  if (posts.length === 0) {
    dispatch({
      type: SET_FEED_MESSAGE,
      payload: {
        header: `${profile.name} has not Tweeted an Image or a Video yet`,
        subText: "",
      },
    });
  } else {
    dispatch({
      type: CLEAR_FEED_MESSAGE,
    });
  }

  dispatch({
    type: GET_MEDIA_SUCCESS,
    payload: {
      posts,
      // pinnedPost: {},
    },
  });
};

const getUsersLikedPosts = (username) => async (dispatch) => {
  dispatch({
    type: FEED_REQUEST_SENT,
  });
  const profilesRef = collection(db, "users");
  const profilesQuery = query(profilesRef, where("username", "==", username));
  const profilesSnapshot = await getDocs(profilesQuery);
  const profile = {
    id: profilesSnapshot.docs[0].id,
    ...profilesSnapshot.docs[0].data(),
  };
  const likesRef = collection(db, `users/${profile.id}/likes`);
  const postIds = await getDocs(likesRef);

  const postDocs = await Promise.all(
    postIds.docs.map(async (post) => await getDoc(doc(db, `posts/${post.id}`)))
  );

  let posts = await Promise.all(
    postDocs
      .filter((post) => post._document !== null)
      .map(async (doc) => await populatePost(doc))
  );

  posts = posts.map((post) => ({
    ...post,
    replyToUsers: post.replyToUsers.posts,
  }));

  if (posts.length === 0) {
    dispatch({
      type: SET_FEED_MESSAGE,
      payload: {
        header: `${profile.name} has not Liked a Tweet yet`,
        subText: "",
      },
    });
  } else {
    dispatch({
      type: CLEAR_FEED_MESSAGE,
    });
  }

  dispatch({
    type: GET_LIKES_SUCCESS,
    payload: {
      posts,
    },
  });
};

const clearFeedMessage = () => (dispatch) => {
  dispatch({
    type: CLEAR_FEED_MESSAGE,
  });
};

const setUsersPostCount = (profileId) => async (dispatch) => {
  const postsCount = await getUsersPostsCount(profileId);

  dispatch({
    type: GET_USERS_POST_COUNT,
    payload: postsCount,
  });
};

const addUsersPostCount = () => async (dispatch) => {
  dispatch({
    type: ADD_USERS_POST_COUNT,
  });
};
const subtractUsersPostCount = () => async (dispatch) => {
  dispatch({
    type: ADD_USERS_POST_COUNT,
  });
};

const refreshPost = (postId) => async (dispatch) => {
  const post = await getPostById(postId);

  dispatch({
    type: REFRESH_POST,
    payload: post,
  });
};

const toggleLikeTweet = (postId) => async (dispatch) => {
  const likes = await toggleLikePost(postId);

  dispatch({
    type: TOGGLE_LIKE_POST,
    payload: {
      postId,
      likes,
    },
  });
};

const getPinnedPost = (username) => async (dispatch) => {
  const post = await fetchPinnedPost(username);

  console.log(post);

  dispatch({
    type: GET_PINNED_POST,
    payload: post,
  });
};

const addPinnedPost = (postId, authId) => async (dispatch, getState) => {
  const pinnedPost = getState().profile.pinnedPost;

  const post = await pinPost(postId, authId, pinnedPost);

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
    payload: postId,
  });
};

const deleteTweet = (postId, authId) => async (dispatch, getState) => {
  const tweetId = await deletePostById(postId, authId);

  dispatch({
    type: DELETE_POST,
    payload: tweetId,
  });
};

const createPost =
  (input, post, user, selectedImageUrl) => async (dispatch) => {
    const createdComment = await createComment(
      input,
      post,
      selectedImageUrl,
      user,
      post.postType
    );

    dispatch({
      type: CREATE_COMMENT,
      payload: {
        createdComment,
        replyToPost: post,
      },
    });

    return createdComment;
  };

const followProfile = (profileId, auth) => async (dispatch, getState) => {
  const { following, followers } = await followUser(profileId, auth.id);

  dispatch({
    type: FOLLOW_USER,
    payload: {
      following,
      followers,
      auth,
    },
  });

  const profile = getState().profile.profile;

  return profile;
};
const unfollowProfile = (profileId, auth) => async (dispatch, getState) => {
  const { followers, following } = await unfollowUser(profileId, auth.id);

  dispatch({
    type: UNFOLLOW_USER,
    payload: {
      followers,
      following,
      auth,
    },
  });
  const profile = getState().profile.profile;

  return profile;
};

const followPostUser = (post, auth) => async (dispatch, getState) => {
  const profile = getState().profile.profile;

  if (profile.id === auth.id) {
    const { following, followers } = await followUser(post.uid, auth.id);
    console.log("Followers: ", followers);

    // const following = await getProfileFollowing(auth.id);
    // const followers = profile.followers;

    dispatch({
      type: FOLLOW_POST_USER,
      payload: {
        followers,
        following,
        post,
        auth,
      },
    });
  } else {
    const { following, followers } = await followUser(post.uid, auth.id);
    console.log("Followers: ", followers);

    dispatch({
      type: FOLLOW_POST_USER,
      payload: {
        followers,
        following,
        post,
        auth,
      },
    });
  }
};
const unfollowPostUser = (post, auth) => async (dispatch, getState) => {
  const profile = getState().profile.profile;

  if (profile.id === auth.id) {
    const { following, followers } = await unfollowUser(post.uid, auth.id);

    console.log("Followers: ", followers);

    // const following = await getProfileFollowing(auth.id);
    // const followers = profile.followers;

    dispatch({
      type: UNFOLLOW_POST_USER,
      payload: {
        followers,
        following,
        post,
        auth,
      },
    });
  } else {
    const { following, followers } = await unfollowUser(post.uid, auth.id);
    console.log("Followers: ", followers);

    dispatch({
      type: UNFOLLOW_POST_USER,
      payload: {
        followers,
        following,
        post,
        auth,
      },
    });
  }
};

const editProfile = (data, profileId) => async (dispatch) => {
  dispatch({
    type: PROFILE_REQUEST_SENT,
  });

  const { bio, location, name, birthday, avatar, banner } = data;

  const profileRef = doc(db, `users/${profileId}`);
  const postsRef = collection(db, `posts`);
  const postsQuery = query(postsRef, where("userRef", "==", profileRef));
  const postsDocs = await getDocs(postsQuery);

  const batch = writeBatch(db);

  batch.update(profileRef, {
    bio,
    location,
    name,
    birthday,
    avatar,
    banner,
  });

  postsDocs.docs.forEach((document) =>
    batch.update(doc(db, `posts/${document.id}`), { avatar })
  );

  await batch.commit();

  const profileSnapshot = await getDoc(profileRef);

  const profile = { id: profileSnapshot.id, ...profileSnapshot.data() };
  const createdAt = handleProfileCreatedAt(profile);

  dispatch({
    type: EDIT_USER,
    payload: { ...profile, createdAt },
  });
};

const getProfileFollowers = (profileId) => async (dispatch) => {
  dispatch({
    type: FEED_REQUEST_SENT,
  });
  let followers = await getFollowers(profileId);

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
  getMediaPosts,
  toggleLikeTweet,
  getPinnedPost,
  addPinnedPost,
  removePinnedPost,
  toggleLikePinPost,
  deleteTweet,
  createPost,
  followProfile,
  unfollowProfile,
  followPostUser,
  unfollowPostUser,
  editProfile,
  refreshPost,
  getProfileFollowers,
  getFollowing,
  setUsersPostCount,
  addUsersPostCount,
  subtractUsersPostCount,
  clearFeedMessage
};
