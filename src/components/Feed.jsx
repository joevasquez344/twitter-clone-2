import React, { useState, useEffect } from "react";
import Tweet from "./Tweet";
import tweetsData from "../mock_data/tweets.data";
import { useDispatch, useSelector } from "react-redux";
// import { getTweets } from "../redux/tweets/tweets.actions";
import { fetchTweets, likeTweetById } from "../utils/api/tweets";
import { getAuth } from "firebase/auth";
import { getTweets, likeTweet } from "../redux/tweets/tweets.actions";
import { doc, getDocs, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { collection, query } from "firebase/firestore/lite";
import { fetchPosts, toggleLikePost } from "../redux/home/home.actions";

const Feed = () => {
  // const tweets = useSelector((state) => state.tweets.tweets);

  const user = useSelector((state) => state.users.user);
  const posts = useSelector((state) => state.home.posts);
  // const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  const dispatch = useDispatch();

  console.log("Tweets from select:", posts);

  // const handleLikeTweet = (tweetId) => {
  //   const resTweet = likeTweetById(tweetId);

  //   const updatedTweets = tweets.map((tweet) => {
  //     if (tweet.id === resTweet.id) {
  //       tweet = resTweet;
  //     }
  //     return tweet;
  //   });

  //   setTweets(updatedTweets);
  // };

  useEffect(() => {
    // dispatch(getTweets(user.id));
    dispatch(fetchPosts(user));
    setLoading(false);
  }, []);

  console.log("TWEETS: ", posts);

  console.log("posts: ", posts);
  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="">
          {posts?.map((tweet) => (
            <Tweet
              stateType="redux"
              likeTweet={likeTweet}
              key={tweet.id}
              id={tweet.id}
              tweet={tweet}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Feed;
