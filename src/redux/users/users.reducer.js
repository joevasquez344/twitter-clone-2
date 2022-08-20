import {
  LOGIN,
  LOAD_USER,
  LOGOUT,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  REGISTER_FAILED,
  REGISTER_SUCCESS,
  GET_USER_DETAILS,
  USER_DETAILS_REQUEST,
  GET_USER_TWEETS,
  GET_USER_TWEETS_AND_REPLIES,
  GET_USER_LIKES,
  FOLLOW_USER,
  UNFOLLOW_USER,
  LIKE_TWEET,
  EDIT_PROFILE,
} from "./users.types";

const initialState = {
  user: null,
  userDetails: {},
  loading: true,
  error: null,
};

const usersReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_USER:
      return {
        ...state,
        user: payload,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: payload,
        error: null,
      };
    case REGISTER_FAILED:
      return {
        ...state,
        user: null,
        error: payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload,
        error: null,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        user: null,
        error: payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: payload,
      };
    case USER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        userDetails: {},
        error: null,
      };
    case GET_USER_DETAILS:
      return {
        ...state,
        userDetails: payload,
        loading: false,
        error: null,
      };

    case GET_USER_TWEETS:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          tweets: payload,
        },
      };

    case GET_USER_TWEETS_AND_REPLIES:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          tweets: payload,
        },
      };

    case GET_USER_LIKES:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          tweets: payload,
        },
      };

    case FOLLOW_USER:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          followers: payload.followers,
          // following: payload.following
        },
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          followers: payload.followers,
          // following: payload.authUserFollowing
        },
      };

    case EDIT_PROFILE:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          ...payload,
        },
      };

    case LIKE_TWEET:
      const updatedTweets = state.userDetails.tweets.map((tweet) => {
        if (tweet.id === payload.tweetId) {
          tweet.likes = payload.likes;
        }
        return tweet;
      });
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          tweets: updatedTweets,
        },
      };

    default:
      return state;
  }
};

export default usersReducer;
