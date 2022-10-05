import {
  GET_POSTS,
  TOGGLE_LIKE_POST,
  GET_USER_LIKES,
  REFRESH_POST,
  GET_TWEETS_AND_REPLIES,
  REFRESH_FEED,
  PROFILE_REQUEST_SENT,
  FEED_REQUEST_SENT,
  GET_FEED_SUCCESS,
  ADD_PINNED_POST,
  REMOVE_PINNED_POST,
  DELETE_POST,
  GET_PROFILE_SUCCESS,
  FOLLOW_USER,
  UNFOLLOW_USER,
  EDIT_USER,
  GET_FOLLOWERS_SUCCESS,
  GET_FOLLOWING_SUCCESS,
  TOGGLE_LIKE_PIN_POST,
  GET_PINNED_POST,
  FOLLOW_POST_USER,
  UNFOLLOW_POST_USER,
} from "./profile.types";

const initialState = {
  profile: {},
  feed: [],
  pinnedPost: {},
  profileLoading: true,
  feedLoading: true,
};

const profileReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PROFILE_REQUEST_SENT:
      return {
        ...state,
        profileLoading: true,
        feed: [],
        pinnedPost: {},
      };

    case FEED_REQUEST_SENT:
      return {
        ...state,
        feedLoading: true,
      };

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        profileLoading: false,
        profile: payload,
        pinnedPost: payload.pinnedPost
      };

    case GET_FEED_SUCCESS:
      return {
        ...state,
        feedLoading: false,
        feed: payload,

      };

    case TOGGLE_LIKE_POST:
      const postsWithUpdatedLikes = state.feed.map((post) => {
        if (post.id === payload.postId) {
          post.likes = payload.likes;
        }

        return post;
      });
      return {
        ...state,
        feed: postsWithUpdatedLikes,
      };

    case REFRESH_POST:
      const posts = state.feed.map((post) => {
        if (post.id === payload.id) {
          post = payload;
        }
        return post;
      });
      return {
        ...state,
        feed: posts,
      };

    case REFRESH_FEED:
      return {
        ...state,
      };

    case GET_TWEETS_AND_REPLIES:
      return {
        ...state,
      };
    case GET_USER_LIKES:
      return {
        ...state,
      };
    case GET_PINNED_POST:
      return {
        ...state,
        pinnedPost: payload,
      };

    case ADD_PINNED_POST:
      return {
        ...state,
        profile: {
          ...state.profile,
          pinnedPost: payload,
        },
        pinnedPost: payload,
      };
    case REMOVE_PINNED_POST:
      return {
        ...state,
        profile: {
          ...state.profile,
          pinnedPost: payload,
        },
        pinnedPost: payload,
      
      };
    case TOGGLE_LIKE_PIN_POST:
      return {
        ...state,
        pinnedPost: {
          ...state.pinnedPost,
          likes: payload,
        },
      };
    case DELETE_POST:
      const updatedPosts = state.feed.filter((post) => post.id !== payload);
      return {
        ...state,
        feed: updatedPosts,
        pinnedPost: state.pinnedPost.id === payload ? {} : state.pinnedPost,
      };
    case FOLLOW_USER:
      return {
        ...state,
        profile: {
          ...state.profile,
          followers: payload.followers,
          // following: payload.following
        },
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        profile: {
          ...state.profile,
          followers: payload.followers,
          // following: payload.authUserFollowing
        },
      };

    case FOLLOW_POST_USER:
      if (state.profile?.id === payload.authId) {
        return {
          ...state,
          profile: {
            ...state.profile,
            following: payload.following,
          },
        };
      } else if (payload.postUid === state.profile.id) {
        return {
          ...state,
          profile: {
            ...state.profile,
            followers: payload.followers,
          },
        };
      } else {
        return {
          ...state,
          profile: {
            ...state.profile,
            following: payload.following,
          },
        };
      }

    case UNFOLLOW_POST_USER:
      if (state.profile?.id === payload.authId) {
        return {
          ...state,
          profile: {
            ...state.profile,
            following: payload.following,
          },
        };
      } else if (payload.postUid === state.profile.id) {
        return {
          ...state,
          profile: {
            ...state.profile,
            followers: payload.followers,
          },
        };
      } else {
        return {
          ...state,
          profile: {
            ...state.profile,
            following: payload.following,
          },
        };
      }
    case EDIT_USER:
      return {
        ...state,
        profileLoading: false,
        profile: {
          ...state.profile,
          ...payload,
        },
      };

    case GET_FOLLOWERS_SUCCESS:
      return {
        ...state,
        feedloading: false,
        feed: payload,
      };
    case GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        feedloading: false,
        feed: payload,
      };

    default:
      return state;
  }
};

export default profileReducer;
