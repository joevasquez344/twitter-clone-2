import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Feed from "../components/Feed";
import Feed2 from "../components/Feed2";
import Loader from "../components/Loader";
import TweetBox from "../components/TweetBox";
import { fetchPosts, likePost } from "../redux/home/home.actions";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.home.posts);

  const handleLikePost = (postId) => {
    dispatch(likePost(postId))
  }

  useEffect(() => {
    dispatch(fetchPosts());
    setLoading(false);
  }, []);
  return (
    <div>
      <TweetBox setLoading={setLoading} />
      {/* <Feed loading={loading} setLoading={setLoading} /> */}
      {loading ? (
        <Loader />
      ) : (
        <Feed2 posts={posts} handleLikePost={handleLikePost} />
      )}
    </div>
  );
};

export default Home;
