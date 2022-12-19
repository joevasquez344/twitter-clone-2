import { SET_DARK_THEME, SET_LIGHT_THEME } from "./theme.types";

const initialState = {
  name: "dark",
  background: "#243447",
  text: "white",
};

const themeReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DARK_THEME:
      return {
        ...state,
        name: "dark",
        background: "#243447",
        text: "white",
      };
    case SET_LIGHT_THEME:
      return {
        ...state,
        name: "light",
        background: "white",
        text: "black",
      };

    default:
      return state;
  }
};

export default themeReducer;
