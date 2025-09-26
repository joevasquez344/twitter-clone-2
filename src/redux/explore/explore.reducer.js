import {
  GET_FOR_YOU
} from "./explore.types";

const initialState = {
  forYou: [],
  trending: [],
  news: [],
  sports: [],
  entertainment: [],
};

const exploreReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_FOR_YOU:
      return {
        ...state,
        posts: payload,
      };

    default:
      return state;
  }
};

export default exploreReducer;
