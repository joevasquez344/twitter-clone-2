import { SET_DARK_THEME, SET_LIGHT_THEME } from "./theme.types";

const initialState = {
  theme: "light",
};

const themeReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_DARK_THEME:
      return {
        ...state,
        theme: "dark",
      };
    case SET_LIGHT_THEME:
      return {
        ...state,
        theme: "light",
      };

    default:
      return state;
  }
};

export default themeReducer;
