import {
  CREATE_BOOKMARK,
  DELETE_BOOKMARK,
  DELETE_POST,
  FOLLOW_USER,
  GET_POSTS,
  REFRESH_POST,
  TOGGLE_LIKE_POST,
  UNFOLLOW_USER,
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

    case FOLLOW_USER:
      const updatedTweets = state.posts.map((post) => {
        if (post.id === payload.postId) {
          post.followers = payload.followers;
        }
        return post;
      });
      return {
        ...state,
        posts: updatedTweets,
      };

    case UNFOLLOW_USER:
      const posts = state.posts.map((post) => {
        if (post.id === payload.postId) {
          post.followers = payload.followers;
        }
        return post;
      });
      return {
        ...state,
        posts,
      };
    case CREATE_BOOKMARK:
      return {
        ...state,
        posts: state.posts.map((post) => {
          payload.bookmarks.map((bookmark) => {
            if (bookmark.id === post.id) {
              post.bookmark = true;
            } else {
              post.bookmark = false
            }
            return bookmark;
          });

          return post;
        }),
      };
    case DELETE_BOOKMARK:
      return {
        ...state,
        posts: state.posts.map((post) => {
          if (post.id === payload.postId) {
            post.bookmark = false;
          } else {
            post.bookmark = false;
          }

          return post;
        }),
      };

    default:
      return state;
  }
};

export default homeReducer;
