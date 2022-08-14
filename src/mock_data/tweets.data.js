const tweetSchema = {
  tweetId: "",
  name: "",
  username: "",
  text: "",
  media: "",
  filter: {
    isTweet: false, 
    isMedia: false,
    isComment: false,
  },
  likes: [],
  comments: [],
};

export default tweetSchema;
