import React, { forwardRef } from "react";
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

const TweetFooter = forwardRef(
  (
    {
      isLiked,
      handleLikePost,
      handleAddBookmark,
      handleRemoveBookmark,
      bookmarks,
      handleOpenCommentModal,
      post,
    },
    ref
  ) => (
    <div className="flex items-center justify-between ml-1">
      <CommentButton
        post={post}
        handleOpenCommentModal={handleOpenCommentModal}
        ref={ref}
      />

      <RetweetButton ref={ref} />
      <LikeButton
        post={post}
        isLiked={isLiked}
        likes={post.likes}
        handleLikePost={handleLikePost}
        ref={ref}
      />
      <BookmarkButton
        bookmarks={bookmarks}
        handleAddBookmark={handleAddBookmark}
        handleRemoveBookmark={handleRemoveBookmark}
        post={post}
        ref={ref}
      />
    </div>
  )
);

export default TweetFooter;
