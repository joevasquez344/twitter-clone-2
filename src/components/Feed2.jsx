import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Tweet2 from "./Tweet2";

const Feed2 = ({posts, handleLikePost}) => {
  return (
    <div>
      {posts?.map((post) => (
        <Tweet2 key={post.id} id={post.id} post={post} handleLikePost={handleLikePost} />
      ))}
    </div>
  );
};

export default Feed2;
