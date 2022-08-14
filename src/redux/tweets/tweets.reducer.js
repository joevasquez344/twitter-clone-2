import {
  GET_TWEETS,
  CREATE_TWEET,
  LIKE_TWEET,
  UNLIKE_TWEET,
} from "./tweets.types";
import { auth } from "../../firebase/config";

const initialState = {
  tweets: [],
};

const tweetsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_TWEETS:
      return {
        ...state,
        tweets: payload,
      };

    case CREATE_TWEET:
      return {
        ...state,
        tweets: [...state.tweets, payload],
      };

    case LIKE_TWEET:
      const updatedTweets = state.tweets.filter((tweet) => {
        if (tweet.id === payload.tweetId) {
          tweet.likes = payload.likes;
        }
        return tweet
      });
      return {
        ...state,
        tweets: updatedTweets,
      };

    default:
      return state;
  }
};

export default tweetsReducer;
