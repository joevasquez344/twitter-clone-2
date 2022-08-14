import React, { useState, useEffect } from "react";
import Feed from "../components/Feed";
import TweetBox from "../components/TweetBox";
import tweetSchema from "../mock_data/tweets.data";
import uuid from "react-uuid";

const Home = () => (
  <div>
    <TweetBox />
    <Feed />
  </div>
);

export default Home;
