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
  addBookmark,
  getBookmarks,
} from "../../utils/api/posts";
import {
  followUser,
  getProfileFollowing,
  getUserDetails,
  unfollowUser,
} from "../../utils/api/users";
import { DELETE_POST } from "../profile/profile.types";
import {
  CREATE_BOOKMARK,
  DELETE_BOOKMARK,
  FOLLOW_USER,
  GET_POSTS,
  REFRESH_POST,
  TOGGLE_LIKE_POST,
  UNFOLLOW_USER,
} from "./home.types";

const getPosts = (user) => async (dispatch) => {
  const query = {
    where: null,
    orderBy: ["timestamp", "desc"],
  };
  const posts = await fetchPosts(query);
  const authUser = await getUserDetails(user.username);
  console.log("user: ", user);
  console.log("authUser: ", authUser);

  posts.map((post) => {
    if (post.uid === user.id) {
      if (authUser.pinnedPost.id && post.id === authUser.pinnedPost?.id) {
        post.pinnedPost = true;
      } else {
        post.pinnedPost = false;
      }
    }

    return post;
  });

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




export {
  getPosts,
  likePost,
  refreshPost,
  deletePost,
  toggleFollowPostUser,
};
