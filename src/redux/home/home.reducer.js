import { GET_POSTS, REFRESH_POST, TOGGLE_LIKE_POST } from "./home.types";

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
    const updatedPosts = state.posts.map(post => {
      if(post.id === payload.id) {
        post = payload
      }
      return post
    })
    return {
      ...state,
      posts: updatedPosts
    }

    default:
      return state;
  }
};

export default homeReducer;
