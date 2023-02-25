import React, { forwardRef } from "react";

import BookmarkButton from "../Buttons/BookmarkButton";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";
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
    <div className="ml-1 flex items-center justify-between">
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
