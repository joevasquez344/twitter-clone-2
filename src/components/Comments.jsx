import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tweet from "./Tweet/Tweet2";
import cageImage from "../images/cage.png";

import { useParams } from "react-router-dom";
import {
  fetchComments,
  likeComment,
} from "../redux/tweet-details/tweet-details.actions";
import Loader from "./Loader";

const Comments = ({
  handleLikePost,
  handleDeletePost,
  handlePinPost,
  handleUnpinPost,
  handleFollowUser,
  handleAddBookmark,
  handleRemoveBookmark,
  handleOpenCommentModal,
  tabs,
  bookmarks,
  fetchComments,
  comments,
  commentsLoading,
  postDetailsDeleted,
}) => {
  const params = useParams();

  useEffect(() => {
    // fetchComments();
  }, [params.tweetId]);
  return (
    <div>
      <div>
        {commentsLoading ? (
          <Loader />
        ) : (
          <div>
            {comments.length === 0 ? (
              <div className="flex justify-center mt-20">
                <div className="w-1/2">
                  <img src={cageImage} alt="" />
                  <div className="text-2xl font-bold text-center">
                    Tweet has no replies
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${postDetailsDeleted && "mt-60 border-t"}`}>
                {comments.map((comment) => (
                  <Tweet
                    id={comment.id}
                    handleLikePost={handleLikePost}
                    handleDeletePost={handleDeletePost}
                    handlePinPost={handlePinPost}
                    handleUnpinPost={handleUnpinPost}
                    handleAddBookmark={handleAddBookmark}
                    handleRemoveBookmark={handleRemoveBookmark}
                    handleFollowUser={handleFollowUser}
                    handleOpenCommentModal={handleOpenCommentModal}
                    tabs={tabs}
                    post={comment}
                    threadPost={false}
                    hidePost={true}
                    bookmarks={bookmarks}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
