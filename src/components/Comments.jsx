import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Comment from "./Comment";
import { useParams } from "react-router-dom";
import { likeCommentById, getComments } from "../utils/api/comments";
import { fetchComments } from "../redux/tweet-details/tweet-details.actions";

const Comments = () => {
  // const [comments, setComments] = useState([]);
  // const [loading, setLoading] = useState(true);
  

  const user = useSelector((state) => state.users.user);
  const {loading, postType} = useSelector(state => state.tweetDetails)
  const tweetRefId = useSelector((state) => state.tweetDetails.post.id);
  const comments = useSelector((state) => state.tweetDetails.comments);
  const params = useParams();
  const dispatch = useDispatch();

  console.log("COMMENTS: ", comments);


  useEffect(() => {
    dispatch(fetchComments(params.tweetId));
  }, [params.tweetId]);
  return (
    <div>
    
        <div>
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              id={comment.id}
              comment={comment}
            />
          ))}
        </div>

    </div>
  );
};

export default Comments;
