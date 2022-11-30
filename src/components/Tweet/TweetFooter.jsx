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
import RetweetButton from "../Buttons/RetweetButton";

const TweetFooter = ({
  isLiked,
  handleLikePost,
  handleAddBookmark,
  handleRemoveBookmark,
  // isBookmarked,
  bookmarks,
  handleOpenCommentModal,
  post,
}) => {

  
  return (
    <div className="flex items-center justify-between ">
      <CommentButton
        post={post}
        handleOpenCommentModal={handleOpenCommentModal}
      />

      <RetweetButton />
      <LikeButton
        post={post}
        isLiked={isLiked}
        likes={post.likes}
        handleLikePost={handleLikePost}
      />
      <BookmarkButton
        // isBookmarked={isBookmarked}
        bookmarks={bookmarks}
        handleAddBookmark={handleAddBookmark}
        handleRemoveBookmark={handleRemoveBookmark}
        post={post}
      />
    </div>
  );
};

export default TweetFooter;
