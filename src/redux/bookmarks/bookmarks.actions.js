import { fetchBookmarks } from "../../utils/api/posts";
import { GET_BOOKMARKS } from "./bookmarks.types";

export const getBookmarks = (authId) => async (dispatch) => {

  console.log('Auth: ', authId)
  const bookmarks = await fetchBookmarks(authId);

  dispatch({
    type: GET_BOOKMARKS,
    payload:bookmarks
  })
};
