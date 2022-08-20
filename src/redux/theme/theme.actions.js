import { SET_DARK_THEME } from "./theme.types";

import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
  updateDoc,
} from "firebase/firestore/lite";
import { db } from "../../firebase/config";

export const setDarkTheme = (user) => async (dispatch) => {
  await updateDoc(doc(db, `users/${user.id}`), {
    theme: "dark",
  });
  dispatch({
    type: SET_DARK_THEME,
  });
};
export const setLightTheme = (user) => async (dispatch) => {
  await updateDoc(doc(db, `users/${user.id}`), {
    theme: "light",
  });
  dispatch({
    type: SET_DARK_THEME,
  });
};

