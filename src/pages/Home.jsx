import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tweet from "../components/Tweet/Tweet2";
import Loader from "../components/Loader";
import TweetBox from "../components/TweetBox";

import {
  addBookmark,
  deletePost,
  getPosts,
  likePost,
  refreshPost,
  removeBookmark,
  toggleFollowPostUser,
} from "../redux/home/home.actions";
import { addBookmarkById, deleteBookmarkById, getBookmarks } from "../utils/api/posts";
import {
  getAllUsers,
  getFollowers,
  getProfileFollowing,
  getUserDetails,
} from "../utils/api/users";
import CommentModal from "../components/CommentModal";
import { createComment } from "../utils/api/comments";
import GiphyModal from "../components/GiphyModal";
import { fetchGifs, fetchTrending } from "../services/giphy";
import SearchBar from "../components/SearchBar";
import SearchModal from "../components/SearchModal";
import { getProfileFollowers } from "../redux/profile/profile.actions";
import { pinTweet, unpinTweet } from "../redux/users/users.actions";

const Home = () => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.home.posts);
  const user = useSelector((state) => state.users.user);
  const authId = useSelector((state) => state.users.user.id);

  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [commentDisplay, setCommentDisplay] = useState({});
  // const [pinnedPost, setPinnedPost] = useState({});
  const [commentModal, setCommentModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [giphyModal, setGiphyModal] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    const searchResults = allUsers.filter(
      (user) =>
        user.username.toLowerCase().match(e.target.value.toLowerCase()) ||
        user.username.toUpperCase().match(e.target.value.toUpperCase())
    );

    setSearchedUsers(searchResults);
  };

  const handleOpenCommentModal = (post) => {
    setCommentModal(true);
    setCommentDisplay(post);
  };

  const handleCloseCommentModal = () => {
    setCommentModal(false);
  };

  const fetchAllUsers = async () => await getAllUsers();

  const handleOpenSearchModal = async () => {
    setSearchModal(true);

    let users = await fetchAllUsers();
    // let authFollowers = await getFollowers(user.id);
    let authFollowing = await getProfileFollowing(user.id);

    users = users.map((user) => {
      // const profileFollowsAuth = authFollowers.find(
      //   (profile) => profile.id === user.id
      // );

      const authFollowsListUser = authFollowing.find(
        (profile) => profile.id === user.id
      );

      const listUserFollowsAuth = user.following.find(
        (profile) => profile.id === authId
      );

      if (listUserFollowsAuth && authFollowsListUser) {
        user.display = "You follow each other";
      } else if (listUserFollowsAuth && !authFollowsListUser) {
        user.display = "Follows you";
      } else if (authFollowsListUser && !listUserFollowsAuth) {
        user.display = "Following";
      } else {
        user.display = null;
      }

      return user;
    });

    console.log("Users; ", users);
    setAllUsers(users);
  };
  const handleCloseSearchModal = () => setSearchModal(false);

  const getAuthBookmarks = async () => {
    const bookmarks = await getBookmarks(user.id);
    setBookmarks(bookmarks);
  };

  const fetchPosts = async () => {
    const posts = await dispatch(getPosts());

    // const pinnedPostMatch = posts.find((post) => post.pinnedPost === true);

    // if (pinnedPostMatch) {
    //   setPinnedPost(pinnedPostMatch);
    // } else {
    //   setPinnedPost({});
    // }

    setLoading(false);
  };

  const createPost = async (e, post) => {
    e.preventDefault();

    handleCloseCommentModal();
    await createComment(input, post, user, post.postType);
    setInput("");
  };
  const handleLikePost = (postId) => dispatch(likePost(postId));
  const handleDeletePost = (postId) => dispatch(deletePost(postId, user.id));
  const handleRefreshPost = (postId) => dispatch(refreshPost(postId));
  const handleRefreshPosts = async () => {
    setLoading(true);

    await dispatch(getPosts());
    setLoading(false);
  }; 
  const handlePinPost = async (post) => dispatch(pinTweet(post, user.id));

  const handleUnpinPost = async (post) =>
    dispatch(unpinTweet(post, user.id));

  const handleFollowUser = async (post) =>
    dispatch(toggleFollowPostUser(post, user.id));

  // const handleAddBookmark = async (postId, userId) => {
  //   dispatch(addBookmark(postId, userId));
  // };

  // const handleRemoveBookmark = async (postId) => {
  //   dispatch(removeBookmark(postId, user.id));
  // };

  const handleAddBookmark = async (postId) => {
    setBookmarks([...bookmarks, postId]);
    await addBookmarkById(postId, user.id);
  };

  const handleRemoveBookmark = async (postId) => {
    setBookmarks(bookmarks.filter((bookmarkId) => bookmarkId !== postId));
    await deleteBookmarkById(postId, user.id);
  };

  useEffect(() => {
    getAuthBookmarks();
    fetchPosts();
  }, []);

  console.log("All Users: ", allUsers);
  return (
    <div className="">
      {giphyModal ? (
        <GiphyModal setGiphyModal={setGiphyModal} fetchGifs={fetchTrending} />
      ) : null}
      {commentModal ? null : (
        <>
          <div className="z-50 sticky top-0 bg-white px-5 py-4 flex flex-col justify-center">
            <SearchBar
              input={searchInput}
              inputChange={handleSearchInput}
              searchModal={searchModal}
              openModal={handleOpenSearchModal}
              closeModal={handleCloseSearchModal}
            />
            <div className="relative">
              <div className="text-xl font-bold">Home</div>{" "}
              {searchModal && (
                <SearchModal
                  searchedUsers={searchedUsers}
                  input={searchInput}
                />
              )}
            </div>
          </div>
        </>
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
        ))
      )}
      {commentModal ? (
        <CommentModal
          post={commentDisplay}
          createPost={createPost}
          input={input}
          handleInputChange={handleInputChange}
          handleCloseCommentModal={handleCloseCommentModal}
          refresh={fetchPosts}
        />
      ) : null}
    </div>
  );
};

export default Home;
