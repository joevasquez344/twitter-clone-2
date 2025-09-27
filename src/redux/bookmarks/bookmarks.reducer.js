import { GET_BOOKMARKS } from "./bookmarks.types";

const initialState = {
  bookmarks: [],
};

const bookmarksReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_BOOKMARKS:
      return {
        ...state,
        bookmarks: payload,
      };
    default:
      return state;
  }
};

export default bookmarksReducer;
