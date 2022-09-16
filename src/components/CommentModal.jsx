import React, { useState } from "react";

import {
  CalendarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  SearchCircleIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";

const CommentModal = ({ post, createPost, input, handleInputChange }) => {
  return (
    <div className="rounded-lg z-50 shadow-lg absolute w-full bg-white">
      <div className="px-5 pt-5 pb-4 flex">
        <img
          className="h-12 w-12 mr-3 rounded-full object-cover"
          src="https://picsum.photos/200"
          alt=""
        />

        <div>
          <div className="flex space-x-1">
            <div className="font-semibold">{post.name}</div>
            <div className="text-gray-500">@{post.username}</div>
            <div className="text-gray-500">Time</div>
          </div>
          {post.message}
        </div>
      </div>
      <div className="px-5 pb-5 border-b">
        <div className="flex w-full">
          <img
            className="h-12 w-12 rounded-full object-cover mt-4"
            src="https://picsum.photos/200"
            alt="Profile Image"
          />
          <div className="ml-3 w-full">
            <form
              onSubmit={(e) => createPost(e, post)}
              className="mt-8 mb-7"
              action=""
            >
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
                onClick={(e) => createPost(e, post)}
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
    </div>
  );
};

export default CommentModal;
