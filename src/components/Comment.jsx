import React, { useState, useEffect } from "react";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
  DotsHorizontalIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";

import { likeComment } from "../redux/tweet-details/tweet-details.actions";

import { useDispatch, useSelector } from "react-redux";

const Comment = ({ comment }) => {
  const user = useSelector((state) => state.users.user);
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTweetDetails = () => {
    navigate(`/${comment.name}/status/${comment.id}`, {
      state: { id: comment.id, type: "comment" },
    });
  };

  const handleUserDetails = () => {
    navigate(`/${comment.username}`);
  };

  const handleIsLiked = (comment) => {
    const liked = comment.likes?.find((like) => like.id === user.id);

    if (liked) setIsLiked(true);
    else setIsLiked(false);
  };

  const handleLikeComment = () => dispatch(likeComment(comment.id));

  useEffect(() => {
    handleIsLiked(comment);
  }, [comment.likes?.length]);

  return (
    <div className=" px-4 py-4 max-h-44 hover:bg-gray-100 transition ease-in-out cursor-pointer duration-200 border-gray-100 border-b">
      <div className="relative flex space-x-2">
        {/* <hr className="absolute left-5 top-10 h-8 border-x border-gray-400" /> */}
        <img
        onClick={handleUserDetails}
          className="mt-2 h-12 w-12 rounded-full object-cover"
          src="https://picsum.photos/200"
          alt=""
        />
        <div className="w-full">
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{comment.name}</p>
            <p className="hidden text-sm text-gray-500 lg:inline">
              @{comment.username?.replace(/\s+/g, "").toLowerCase()}
            </p>
            {/* <TimeAgo
                    className="text-sm text-gray-500"
                        date={comment._createdAt}
                              /> */}
          </div>
          <p onClick={handleTweetDetails} className="mb-3">
            {comment.message}
          </p>
          <div className="flex items-center justify-between pb-3">
            <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
              <ChatAlt2Icon className="h-5 w-5" />
              <p className="text-sm"> </p>
            </div>
            <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
              <SwitchHorizontalIcon className={`h-5 w-5 `} />
            </div>
            <div
              onClick={handleLikeComment}
              className={`flex cursor-pointer items-center space-x-3 text-${
                isLiked ? "red" : "gray"
              }-400`}
            >
              <HeartIcon
                fill={isLiked ? "red" : "transparent"}
                className="h-5 w-5"
              />
              <p className="text-sm">
                {comment.likes?.length === 0 ? "" : comment.likes?.length}
              </p>
            </div>
            <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
              <UploadIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
