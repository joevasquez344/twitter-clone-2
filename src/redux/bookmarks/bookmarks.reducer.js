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
    bookmarks: [],
  };
  
  const bookmarksReducer = (state = initialState, { type, payload }) => {
    switch (type) {
     
      default:
        return state;
    }
  };
  
  export default bookmarksReducer;
  