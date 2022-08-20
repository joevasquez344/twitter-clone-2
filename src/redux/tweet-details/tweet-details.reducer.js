import {
  GET_TWEETS,
  CREATE_TWEET,
  LIKE_TWEET,
  UNLIKE_TWEET,
  GET_TWEET_DETAILS,
  LIKE_COMMENT,
  CREATE_COMMENT,
  UNLIKE_COMMENT,
  SET_LOADING,
  GET_COMMENTS,
  CLEAR_TWEET_DETAILS,
  TWEET_DETAILS_REQUEST,
  TWEET_DETAILS_SUCCESS,
  LIKE_COMMENT_DETAILS,
  LIKE_TWEET_DETAILS,
  LIKE_REPLIED_TO_POST,
} from "./tweet-details.types";

const initialState = {
  repliedToPosts: [],
  post: {},
  comments: [],
  loading: true,
  postType: "",
};

const tweetDetailsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: false,
      };
    case TWEET_DETAILS_REQUEST:
      return {
        ...state,
        post: {},
        comments: [],
        loading: true,
      };

    case TWEET_DETAILS_SUCCESS:

      return {
        ...state,
        post: payload,
        repliedToPosts: payload.replyToUsers,
        loading: false,
      };
    case LIKE_TWEET_DETAILS:
      return {
        ...state,
        post: {
          ...state.post,
          likes: payload.likes,
        },
      };

    case GET_COMMENTS:
      return {
        ...state,
        comments: payload,
      };

    case LIKE_COMMENT_DETAILS:
      return {
        ...state,
        tweet: {
          ...state.tweet,
          likes: payload,
        },
      };
    case LIKE_COMMENT:
      const updatedComments = state.comments.map((comment) => {
        if (comment.id === payload.tweetId) {
          comment.likes = payload.likes;
        }
        return comment;
      });
      return {
        ...state,
        comments: updatedComments,
      };
      case LIKE_REPLIED_TO_POST: 
      const updatedPosts = state.repliedToPosts.map((post) => {
        if (post.id === payload.postId) {
          post.likes = payload.likes;
        }
        return post;
      });
      return {
        ...state,
        repliedToPosts: updatedPosts
      }

    default:
      return state;
  }
};

export default tweetDetailsReducer;
