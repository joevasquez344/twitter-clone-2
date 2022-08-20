import {
  GET_TWEETS,
  CREATE_TWEET,
  LIKE_TWEET,
  UNLIKE_TWEET,
  GET_TWEET_DETAILS,
  UNLIKE_COMMENT,
  LIKE_COMMENT,
} from "./tweets.types";
import { db } from "../../firebase/config";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  fetchTweets,
  toggleLikeTweet,
} from "../../utils/api/tweets";

const likeTweet = (tweetId) => async (dispatch) => {
  const likes = await toggleLikeTweet(tweetId)

  console.log('LIKES FROM ACTIONS: ', likes)

  dispatch({
    type: LIKE_TWEET,
    payload: {
      tweetId,
      likes
    }
  })
};

export {likeTweet };
