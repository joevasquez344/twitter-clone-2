import React, { useState, useEffect } from "react";
import Tweet from "./Tweet/Tweet2";

const Feed = ({ fetchData }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const posts = fetchData();
    setPosts(posts);
  }, []);
  return (
    <div>
      {posts.map((post) => (
        <Tweet
          key={post.id}
          id={post.id}
          post={post}
          isPinned={post.pinnedPost ? true : false}
        //   handleLikePost={handleLikePost}
        //   handleRefreshPost={handleRefreshPost}
        //   fetchProfile={fetchProfile}
        //   handlePinPost={handlePinPost}
        //   handleUnpinPost={handleUnpinPost}
        //   handleDeletePost={handleDeletePost}
        //   handleFollowUser={handleToggleFollow}
        //   handleOpenCommentModal={handleOpenCommentModal}
        //   tabs={tabs}
        //   bookmarks={bookmarks}
        />
      ))}
    </div>
  );
};

export default Feed;
