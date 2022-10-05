import React from "react";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/outline";
import BookmarkButton from "../Buttons/BookmarkButton";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";

const TweetFooter = ({
  likes,
  isLiked,
  handleLikePost,
  handleAddBookmark,
  handleOpenCommentModal,
  post,
}) => {
  return (
    <div className="flex items-center justify-between">

          <CommentButton
            post={post}
            handleOpenCommentModal={handleOpenCommentModal}
          />
    
      <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
        <SwitchHorizontalIcon className={`h-5 w-5 `} />
      </div>
      <LikeButton
        post={post}
        isLiked={isLiked}
        likes={likes}
        handleLikePost={handleLikePost}
      />
      <BookmarkButton handleAddBookmark={handleAddBookmark} />
    </div>
  );
};

export default TweetFooter;
