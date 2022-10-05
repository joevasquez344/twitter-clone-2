import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tweet from "../components/Tweet/Tweet2";
import Loader from "../components/Loader";
import TweetBox from "../components/TweetBox";

import {
  deletePost,
  getPosts,
  likePost,
  refreshPost,
  toggleFollowPostUser,
} from "../redux/home/home.actions";
import {
  getBookmarks,
  pinPost,
  unpinPost,
  addBookmark,
} from "../utils/api/posts";
import { getUserDetails } from "../utils/api/users";
import CommentModal from "../components/CommentModal";
import { createComment } from "../utils/api/comments";
import GiphyModal from "../components/GiphyModal";
import { fetchGifs, fetchTrending } from "../services/giphy";

const Home = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.home.posts);
  const user = useSelector((state) => state.users.user);
  const authId = useSelector((state) => state.users.user.id);

  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [commentDisplay, setCommentDisplay] = useState({});
  const [pinnedPost, setPinnedPost] = useState({});
  const [commentModal, setCommentModal] = useState(false);
  const [giphyModal, setGiphyModal] = useState(false);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleOpenCommentModal = (post) => {
    setCommentModal(true);
    setCommentDisplay(post);
  };

  const handleCloseCommentModal = () => {
    setCommentModal(false);
  };

  const fetchPosts = async () => {
    const posts = await dispatch(getPosts(user));

    const pinnedPostMatch = posts.find((post) => post.pinnedPost === true);

    if (pinnedPostMatch) {
      setPinnedPost(pinnedPostMatch);
    } else {
      setPinnedPost({});
    }

    setLoading(false);
  };

  const createPost = async (e, post) => {
    e.preventDefault();

    handleCloseCommentModal();
    await createComment(input, post, user, post.postType);
    setInput("");
    fetchPosts();
  };
  const handleLikePost = (postId) => dispatch(likePost(postId));
  const handleDeletePost = (postId) => dispatch(deletePost(postId, user.id));
  const handleRefreshPost = (postId) => dispatch(refreshPost(postId));
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
    const post = await pinPost(postId, authId);
    const postUserId = post.uid;

    if (postUserId === authId) {
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
  };

  const handleFollowUser = async (post) => {
    dispatch(toggleFollowPostUser(post, user.id));
  };

  const createBookmark = async (postId) => {
    const bookmarks = await getBookmarks(user.id);

    const alreadyBookmarked = bookmarks.find((post) => post.id === postId);

    if (alreadyBookmarked) {
    } else {
      await addBookmark(postId, user.id);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  console.log("Pinned Post: ", pinnedPost);
  return (
    <div className="">
      {giphyModal ? (
        <GiphyModal setGiphyModal={setGiphyModal} fetchGifs={fetchTrending} />
      ) : null}
      {commentModal ? null : (
        <div className="z-50 sticky top-0 bg-white px-5 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">Home</div>
        </div>
      )}

      <TweetBox setGiphyModal={setGiphyModal} setLoading={setLoading} />
      {loading ? (
        <Loader />
      ) : (
        posts.map((post) => (
          <Tweet
            key={post.id}
            id={post.id}
            post={post}
            isPinned={
              pinnedPost?.id && pinnedPost?.id === post.id ? true : false
            }
            handleLikePost={handleLikePost}
            handleDeletePost={handleDeletePost}
            handleRefreshPost={handleRefreshPost}
            handleRefreshPosts={handleRefreshPosts}
            handlePinPost={handlePinPost}
            handleUnpinPost={handleUnpinPost}
            handleFollowUser={handleFollowUser}
            handleAddBookmark={createBookmark}
            handleOpenCommentModal={handleOpenCommentModal}
          />
        ))
      )}
      {commentModal ? (
        <CommentModal
          post={commentDisplay}
          createPost={createPost}
          input={input}
          handleInputChange={handleInputChange}
          handleCloseCommentModal={handleCloseCommentModal}
        />
      ) : null}
    </div>
  );
};

export default Home;
