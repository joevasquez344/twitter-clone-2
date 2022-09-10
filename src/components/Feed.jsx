import React, { useState, useEffect } from "react";
import Tweet from "./Tweet";
import { useDispatch, useSelector } from "react-redux";
import { likeTweet } from "../redux/tweets/tweets.actions";
import { getPosts } from "../redux/home/home.actions";
import Loader from "./Loader";

const Feed = ({loading, setLoading}) => {
  const user = useSelector((state) => state.users.user);
  const posts = useSelector((state) => state.home.posts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts(user));
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
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
