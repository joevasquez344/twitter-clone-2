import { ADD_BOOKMARK } from "../bookmarks/bookmarks.actions";
import {
  CREATE_BOOKMARK,
  CREATE_POST,
  DELETE_BOOKMARK,
  DELETE_POST,
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

const initialState = {
  posts: [],
};

const homeReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
      };

      case CREATE_POST: 
      return {
        ...state,
        posts: [payload, ...state.posts]
      }

    case TOGGLE_LIKE_POST:
      const postsWithUpdatedLikes = state.posts.map((post) => {
        if (post.id === payload.postId) {
          post.likes = payload.likes;
        }

        return post;
      });
      return {
        ...state,
        posts: postsWithUpdatedLikes,
      };

    case REFRESH_POST:
      const updatedPosts = state.posts.map((post) => {
        if (post.id === payload.id) {
          post = payload;
        }
        return post;
      });
      return {
        ...state,
        posts: updatedPosts,
      };

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== payload),
      };

    case UPDATE_POST_IN_FEED:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === payload) {
            post = {
              ...post,
              comments: [...post.comments, payload],
            };
          }

          return post;
        }),
      };
      

    case FOLLOW_TWEET_USER:
      const updatedTweets = state.posts.map((post) => {
        if (post.uid === payload.uid) {
          post.followers = payload.followers;
        }
        return post;
      });
      return {
        ...state,
        posts: updatedTweets,
      };

    case UNFOLLOW_TWEET_USER:
      const posts = state.posts.map((post) => {
        if (post.uid === payload.uid) {
          post.followers = payload.followers;
        }
        return post;
      });
      return {
        ...state,
        posts,
      };
    case TOGGLE_FOLLOW_USER:
      const updatedPostsFollowers = state.posts.map((post) => {
        if (post.id === payload.postId) {
          post.followers = payload.followers;
        }
        return post;
      });
      return {
        ...state,
        posts: updatedPostsFollowers,
      };
    case ADD_BOOKMARK:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === payload) {
            post.bookmarkedByAuthUser = true;
          }

          return post;
        }),
      };
    case DELETE_BOOKMARK:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === payload) {
            post.bookmarkedByAuthUser = false;
          }

          return post;
        }),
      };
    case PIN_POST:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === payload) {
            post.pinnedPost = true;
          }

          return post;
        }),
      };
    case UNPIN_POST:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === payload) {
            post.pinnedPost = false;
          }

          return post;
        }),
      };


    default:
      return state;
  }
};

export default homeReducer;
