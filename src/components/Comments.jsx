import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tweet from "./Tweet";
import { useParams } from "react-router-dom";
import { fetchComments, likeComment } from "../redux/tweet-details/tweet-details.actions";

const Comments = () => {
  const comments = useSelector((state) => state.tweetDetails.comments);
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchComments(params.tweetId));
  }, [params.tweetId]);
  return (
    <div>
    
        <div>
          {comments.map((comment) => (
            <Tweet
              key={comment.id}
              id={comment.id}
              tweet={comment}
              stateType="redux-comments"
            />
          ))}
        </div>

    </div>
  );
};

export default Comments;
