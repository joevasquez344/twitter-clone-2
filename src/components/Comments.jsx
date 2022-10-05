import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tweet from "./Tweet/Tweet2";
import { useParams } from "react-router-dom";
import {
  fetchComments,
  likeComment,
} from "../redux/tweet-details/tweet-details.actions";
import Loader from "./Loader";

const Comments = ({
  post,
  handleLikePost,
  handleDeletePost,
  handlePinPost,
  handleUnpinPost,
  handleFollowUser,
  handleOpenCommentModal,
  isPinned,
  tabs,
}) => {
  const comments = useSelector((state) => state.tweetDetails.comments);
  const params = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchComments(params.tweetId));
    setLoading(false);
  }, [params.tweetId]);
  return (
    <div>
      <div>
        {loading ? (
          <Loader />
        ) : (
          comments.map((comment) => (
            <Tweet
              id={comment.id}
              handleLikePost={handleLikePost}
              handleDeletePost={handleDeletePost}
              handlePinPost={handlePinPost}
              handleUnpinPost={handleUnpinPost}
              handleFollowUser={handleFollowUser}
              handleOpenCommentModal={handleOpenCommentModal}
              isPinned={isPinned}
              tabs={tabs}
              post={comment}
              threadPost={false}
              hidePost={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
