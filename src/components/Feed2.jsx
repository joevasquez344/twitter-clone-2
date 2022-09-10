import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Tweet2 from "./Tweet2";

const Feed2 = ({
  posts,
  pinnedPost,
  handleLikePost,
  handleRefreshPost,
  handleRefreshPosts,
}) => {
  return (
    <div>
      {posts?.map((post) => (
        <Tweet2
          key={post.id}
          id={post.id}
          post={post}
          pinnedPost={pinnedPost}
          handleLikePost={handleLikePost}
          handleRefreshPost={handleRefreshPost}
          handleRefreshPosts={handleRefreshPosts}
        />
      ))}
    </div>
  );
};

export default Feed2;
