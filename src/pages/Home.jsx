import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Feed from "../components/Feed";
import Feed2 from "../components/Feed2";
import Tweet from "../components/Tweet2";
import Loader from "../components/Loader";
import TweetBox from "../components/TweetBox";
import { getPosts, likePost, refreshPost } from "../redux/home/home.actions";
import { pinPost, unpinPost } from "../utils/api/posts";
import { getUserDetails } from "../utils/api/users";

// TODOs: 
// Fix fetch posts after post creation
// Delete Post
// Add/Remove Bookmark
// Create Comment Modal (also implement @ feature)


const Home = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.home.posts);
  const user = useSelector((state) => state.users.user);
  const [pinnedPost, setPinnedPost] = useState({});

  const handleLikePost = (postId) => {
    dispatch(likePost(postId));
  };

  const handleRefreshPost = (postId) => {
    dispatch(refreshPost(postId));
  };
  const handleRefreshPosts = async () => {
    setLoading(true);
    const query = {
      where: ["postType", "==", "tweet"],
      orderBy: ["timestamp", "desc"],
    };
    await dispatch(getPosts(query));
    setLoading(false);
  };
  const handlePinPost = async (postId) => {
    const post = await pinPost(postId, user.id);

    if (post.uid === user.id) {
      const authUser = await getUserDetails(user.username);

      

      setPinnedPost(authUser.pinnedPost);
    }
  };

  const handleUnpinPost = async (postId) => {
    const post = await unpinPost(postId, user.id);

    if (post.uid === user.id) {
      const authUser = await getUserDetails(user.username);

      
      setPinnedPost(authUser.pinnedPost);
    }
  }

  useEffect(() => {
    // const query = {
    //   where: ["postType", "==", "tweet"],
    //   orderBy: ["timestamp", "desc"],
    // };
    dispatch(getPosts(user));
    setLoading(false);
  }, []);
  return (
    <div>
      <TweetBox setLoading={setLoading} />
      {/* <Feed loading={loading} setLoading={setLoading} /> */}
      {loading ? (
        <Loader />
      ) : (
        posts.map((post) => (
          <Tweet
            key={post.id}
            id={post.id}
            post={post}
            isPinned={post.id === pinnedPost ? true : false}
            handleLikePost={handleLikePost}
            handleRefreshPost={handleRefreshPost}
            handleRefreshPosts={handleRefreshPosts}
            handlePinPost={handlePinPost}
            handleUnpinPost={handleUnpinPost}
          />
          // <Feed2 posts={posts} handleLikePost={handleLikePost} handleRefreshPost={handleRefreshPost} />
        ))
      )}
    </div>
  );
};

export default Home;
