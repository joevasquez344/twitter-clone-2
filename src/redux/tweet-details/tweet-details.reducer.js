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
  CLEAR_TWEET_DETAILS,
  TWEET_DETAILS_REQUEST,
  TWEET_DETAILS_SUCCESS,
  LIKE_COMMENT_DETAILS,
  LIKE_TWEET_DETAILS,
  LIKE_REPLIED_TO_POST,
  DELETE_COMMENT,
  DELETE_REPLIED_TO_POST,
  GET_THREAD_POSTS,
  DELETE_POST,
  TWEET_DETAILS_FAILED,
  COMMENTS_REQUEST_SENT,
  GET_COMMENTS_SUCCESS,
} from "./tweet-details.types";

const initialState = {
  repliedToPosts: [],
  post: {},
  comments: [],
  commentsLoading: true,
  loading: true,
  error: null,
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
        post: payload.postDetails,
        repliedToPosts: payload.posts,
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

    case COMMENTS_REQUEST_SENT:
      return {
        ...state,
        commentsLoading: true,
      };

    case GET_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: payload,
        commentsLoading: false,
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
        repliedToPosts: updatedPosts,
      };

    case DELETE_POST:
      return {
        ...state,
        post: payload,
      };

    case DELETE_COMMENT:
      const updatedTweets = state.comments.filter(
        (comment) => comment.id !== payload
      );
      return {
        ...state,
        comments: updatedTweets,
      };
    case DELETE_REPLIED_TO_POST:
      return {
        ...state,
        repliedToPosts: state.repliedToPosts.filter(
          (post) => post.id !== payload
        ),
      };

    case GET_THREAD_POSTS:
      return {
        ...state,
        repliedToPosts: payload.posts,
      };

    default:
      return state;
  }
};

export default tweetDetailsReducer;
