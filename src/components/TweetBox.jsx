import React, { useState } from "react";
import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { getTweets, newTweet } from "../redux/tweets/tweets.actions";
import { createTweet, fetchTweets } from "../utils/api/tweets";
import { db } from "../firebase/config";
import {
  collection,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore/lite";
import { addDoc } from "firebase/firestore";
import { fetchPosts } from "../redux/home/home.actions";

const TweetBox = () => {
  const user = useSelector((state) => state.users.user);
  const [input, setInput] = useState("");

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createTweet(input, user);
    dispatch(getTweets());
    setInput("");

    // Notify that tweet has been successfully created with a toast animation or other form of animation
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const postData = {
      uid: user.id,
      userRef: doc(db, `users/${user.id}`),
      name: user.name,
      email: user.email,
      username: user.username,
      message: input,
      media: "",
      avatar: "",
      timestamp: serverTimestamp(),
      postType: "tweet",
      replyTo: doc(db, `posts/${null}`),
    };

    const ref = collection(db, `posts`);
    await addDoc(ref, postData);

    dispatch(fetchPosts(user));

    setInput("");
  };

  return (
    <div className="p-5 border-b">
      <div className="text-xl font-bold">Home</div>
      <div className="flex w-full">
        <img
          className="h-12 w-12 rounded-full object-cover mt-4"
          src="https://picsum.photos/200"
          alt="Profile Image"
        />
        <div className="ml-3 w-full">
          <form onSubmit={handleCreatePost} className="mt-8 mb-7" action="">
            <input
              value={input}
              onChange={handleInputChange}
              className="text-xl text-gray-900 outline-none"
              type="text"
              placeholder="What's happening?"
            />
          </form>
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2 text-blue-400 flex-1">
              <PhotographIcon className="h-5 w-5 hover:cursor-pointer transition-transform duration-150 ease-out hover:scale-150" />
              <SearchCircleIcon className="h-5 w-5" />
              <EmojiHappyIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <LocationMarkerIcon className="h-5 w-5" />
            </div>
            <div
              onClick={handleCreatePost}
              disabled={input === "" ? true : false}
              className={`text-white bg-blue-${
                input === "" ? "300" : "400"
              } py-2 px-4 rounded-full cursor-${
                input === "" ? "default" : "pointer"
              }`}
            >
              Tweet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetBox;
