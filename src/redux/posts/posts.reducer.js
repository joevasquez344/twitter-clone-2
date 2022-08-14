import {
    GET_TWEETS,
    CREATE_TWEET,
    LIKE_TWEET,
    UNLIKE_TWEET,
  } from "./tweets.types";
  import { auth } from "../../firebase/config";
  
  const initialState = {
    posts: [],
  };
  
  const tweetsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
      case GET_TWEETS:
        return {
          ...state,
          tweets: payload,
        };
  
     
  
      default:
        return state;
    }
  };
  
  export default tweetsReducer;
  