import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tweet from "../components/Tweet/Tweet2";
import Loader from "../components/Loader";
import TweetBox from "../components/TweetBox";
import { Tooltip } from "@material-tailwind/react";

import {
  deletePost,
  getPosts,
  likePost,
  refreshPost,
  toggleFollowPostUser,
  updatePostInFeedAfterCommentCreation,
} from "../redux/home/home.actions";
import {
  addBookmarkById,
  deleteBookmarkById,
  getBookmarkIds,
} from "../utils/api/posts";
import { getAllUsers, getProfileFollowing } from "../utils/api/users";
import CommentModal from "../components/CommentModal";
import GiphyModal from "../components/GiphyModal";
import { fetchTrending } from "../services/giphy";
import SearchBar from "../components/SearchBar";
import SearchModal from "../components/SearchModal";
import { pinTweet, unpinTweet } from "../redux/users/users.actions";
import ProfileSuggestions from "../components/ProfileSuggestions";
import TweetModal from "../components/TweetModal";
import { TOGGLE_LIKE_POST } from "../redux/profile/profile.types";

const Home = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.home.posts);
  const user = useSelector((state) => state.users.user);

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [input, setInput] = useState("");
  const [commentDisplay, setCommentDisplay] = useState({});
  const [commentModal, setCommentModal] = useState(false);
  const [giphyModal, setGiphyModal] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleOpenCommentModal = (post) => {
    setCommentModal(true);
    setCommentDisplay(post);
  };

  const handleCloseCommentModal = () => {
    setCommentModal(false);
  };

  const getAuthBookmarks = async () => {
    const bookmarkIds = await getBookmarkIds(user.id);

    setBookmarks(bookmarkIds);
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);

    await dispatch(getPosts());

    setLoadingPosts(false);
  };

  const handleLikePost = (postId) => {
    dispatch(likePost(postId));
  };
  const handleDeletePost = (postId) => dispatch(deletePost(postId, user.id));
  const handleRefreshPost = (postId) => dispatch(refreshPost(postId));
  const handleRefreshPosts = () => {
    dispatch(getPosts());
    setLoadingPosts(false);
  };
  const handlePinPost = async (post) => dispatch(pinTweet(post, user.id));

  const handleUnpinPost = async (post) => dispatch(unpinTweet(post, user.id));

  const handleFollowUser = async (post) => {
    dispatch(toggleFollowPostUser(post, user.id));

    const match = post.followers.find((u) => u.id === user.id);

    if (match) {
      const updatedSuggested = suggestedUsers.map((u) => {
        if (u.id === post.uid) {
          u.followers = u.followers.filter((u) => u.id !== user.id);
        }

        return u;
      });

      setSuggestedUsers(updatedSuggested);
    } else {
      const updatedSuggested = suggestedUsers.map((u) => {
        if (u.id === post.uid) {
          u.followers = [...u.followers, user];
        }

        return u;
      });
      setSuggestedUsers(updatedSuggested);
    }
  };

  const handleAddBookmark = async (postId) => {
    setBookmarks([...bookmarks, postId]);
    await addBookmarkById(postId, user.id);
  };

  const handleRemoveBookmark = async (postId) => {
    setBookmarks(bookmarks.filter((bookmarkId) => bookmarkId !== postId));
    await deleteBookmarkById(postId, user.id);
  };

  const updateTweetInFeedAfterCommentCreation = (replyToId) => {
    dispatch(updatePostInFeedAfterCommentCreation(replyToId));
  };

  useEffect(() => {
    getAuthBookmarks();
    if (posts.length === 0) fetchPosts();
  }, []);

  return (
    <div className="">
      {giphyModal ? (
        <GiphyModal setGiphyModal={setGiphyModal} fetchGifs={fetchTrending} />
      ) : null}

      <div className="sticky hidden sm:flex top-20 sm:top-0 bg-white w-full z-40 text-md px-4 py-2 sm:text-xl font-bold sm:p-4">
        Home
      </div>{" "}
      <TweetBox setGiphyModal={setGiphyModal} setLoading={setLoadingPosts} />
      <ProfileSuggestions users={suggestedUsers} setUsers={setSuggestedUsers} />
      {loadingPosts ? (
        <Loader />
      ) : (
        <>
          <Tooltip
            className="hidden sm:flex p-1 rounded-sm text-xs bg-gray-500"
            placement="bottom"
            content="Refresh Feed"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 1 },
            }}
          >
            <div
              onClick={fetchPosts}
              className="border-b w-full px-6 flex justify-center items-center h-9 sm:h-10 sm:hover:bg-blue-50 transition ease-in-out cursor-pointer duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
          </Tooltip>
          {posts.map((post) => (
            <Tweet
              key={post.id}
              id={post.id}
              post={post}
              isPinned={
                // pinnedPost?.id && pinnedPost?.id === post.id ? true : false
                null
              }
              handleLikePost={handleLikePost}
              handleDeletePost={handleDeletePost}
              handleRefreshPost={handleRefreshPost}
              handleRefreshPosts={handleRefreshPosts}
              handlePinPost={handlePinPost}
              handleUnpinPost={handleUnpinPost}
              handleFollowUser={handleFollowUser}
              handleAddBookmark={handleAddBookmark}
              handleRemoveBookmark={handleRemoveBookmark}
              handleOpenCommentModal={handleOpenCommentModal}
              bookmarks={bookmarks}
            />
          ))}
        </>
      )}
      {commentModal ? (
        <CommentModal
          post={commentDisplay}
          input={input}
          handleInputChange={handleInputChange}
          handleCloseCommentModal={handleCloseCommentModal}
          updateTweetInFeedAfterCommentCreation={
            updateTweetInFeedAfterCommentCreation
          }
        />
      ) : null}
    </div>
  );
};

export default Home;
