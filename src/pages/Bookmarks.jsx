import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tweet from "../components/Tweet/Tweet2";
import cageImage from "../images/cage.png";
import {
  getBookmarks,
  toggleLikePost,
  clearBookmarks,
  deleteBookmarkById,
  deletePostById,
} from "../utils/api/posts";

import { db } from "../firebase/config";
import {
  collection,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore/lite";
import { addDoc } from "firebase/firestore";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
  DotsHorizontalIcon,
  LocationMarkerIcon,
  TrashIcon,
  UserAddIcon,
  UserRemoveIcon,
  BanIcon,
  XIcon,
  CalendarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { followUser, getFollowers, unfollowUser } from "../utils/api/users";
import Loader from "../components/Loader";
import CommentModal from "../components/CommentModal";
import Comments from "../components/Comments";
import { createComment } from "../utils/api/comments";
import { removeDuplicateUsernames } from "../utils/helpers";
import BookmarkButton from "../components/Buttons/BookmarkButton";
import LastSeen from "../components/LastSeen";
import PinListItem from "../components/ListItems/PinListItem";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [modal, setModal] = useState(false);
  const user = useSelector((state) => state.users.user);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    let bookmarks = await getBookmarks(user.id);

    bookmarks.map((post) => {
      const userLiked = post.likes.find((u) => u.id === user.id);
      if (userLiked) {
        post.isLiked = true;
      } else {
        post.isLiked = false;
      }

      const isFollowing = post.followers.find((u) => u.id === user.id);
      if (isFollowing) {
        post.authIsFollowing = true;
      } else {
        post.authIsFollowing = false;
      }

      post.modal = false;
      post.bookmarkModal = false;
      post.commentModal = false;

      return post;
    });

    setBookmarks(bookmarks);

    setLoading(false);
  };

  const toggleLikeBookmark = async (postId) => {
    const likes = await toggleLikePost(postId);

    const updatedBookmarks = bookmarks.map((post) => {
      if (post.id === postId) {
        post.likes = likes;
        const userLiked = post.likes.find((u) => u.id === user.id);
        if (userLiked) {
          post.isLiked = true;
        } else {
          post.isLiked = false;
        }
      }

      return post;
    });

    setBookmarks(updatedBookmarks);
  };

  const followOrUnfollowUser = async (post) => {
    if (post.uid !== user.id) {
      const followers = await getFollowers(post.uid);

      const authUserFollowing = followers.find((u) => u.id === user.id);

      if (authUserFollowing) {
        const { followers } = await unfollowUser(post.uid, user.id);

        const updatedBookmarks = bookmarks.map((bookmark) => {
          bookmark.followers = followers;

          bookmark.authIsFollowing = false;

          return bookmark;
        });

        setBookmarks(updatedBookmarks);
      } else {
        const { followers } = await followUser(post.uid, user.id);
        const updatedBookmarks = bookmarks.map((bookmark) => {
          bookmark.followers = followers;

          bookmark.authIsFollowing = true;

          return bookmark;
        });

        setBookmarks(updatedBookmarks);
      }
    }
  };

  const clearAllBookmarks = async () => {
    setModal(false);

    const { message, success } = await clearBookmarks(user.id);

    if (success === true) {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        setBookmarks([]);
      }, "1000");

      setTimeout(() => {
        setNotification(message);
      }, "1100");

      setTimeout(() => {
        setNotification(null);
      }, "3000");
    }
  };

  const removeBookmark = async (postId) => {
    await deleteBookmarkById(postId, user.id);

    const updatedBookmarks = bookmarks.filter((post) => post.id !== postId);

    setBookmarks(updatedBookmarks);
  };

  const handleCloseCommentModal = (postId) => {
    const updatedBookmarks = bookmarks.map((post) => {
      post.modal = false;
      post.bookmarkModal = false;
      post.commentModal = false;

      if (post.id === postId) {
        post.commentModal = false;
      }

      return post;
    });

    setBookmarks(updatedBookmarks);
  };

  const handleDeletePost = async (postId) => {
    const id = await deletePostById(postId, user.id);

    const deletedPost = bookmarks.find((post) => post.id === id);

    if (deletedPost) {
      const updatedBookmarks = bookmarks.filter(
        (post) => post.id !== deletedPost.id
      );

      setBookmarks(updatedBookmarks);
    }
  };

  const handleOpenBookmarkModal = (postId) => {
    const updatedBookmarks = bookmarks.map((post) => {
      post.modal = false;
      post.bookmarkModal = false;
      post.commentModal = false;
      if (post.id === postId) {
        post.commentModal = true;
      }

      return post;
    });

    setBookmarks(updatedBookmarks);
  };

  const createPost = async (e, post) => {
    e.preventDefault();

    await createComment(input, post, null, user, post.postType);

    setInput("");

    fetchBookmarks();
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const openModal = (postId) => {
    const updatedBookmarks = bookmarks.map((post) => {
      post.modal = false;
      post.bookmarkModal = false;
      post.commentModal = false;

      if (post.id === postId) {
        post.modal = true;
      }

      return post;
    });

    setBookmarks(updatedBookmarks);
  };
  const closeModal = (postId) => {
    const updatedBookmarks = bookmarks.map((post) => {
      post.modal = false;
      post.bookmarkModal = false;
      post.commentModal = false;
      if (post.id === postId) {
        post.modal = false;
      }

      return post;
    });

    setBookmarks(updatedBookmarks);
  };

  const routeTweetDetails = async (postId) => {
    navigate(`/${user.username}/status/${postId}`);
  };
  const routeUserDetails = async (username) => {
    navigate(`/${username}`);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  console.log("Bookmarks: ", bookmarks);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative">
          <div className="z-50 sticky top-0 bg-white px-5 py-2 flex justify-between items-center">
            <div>
              <div className="text-xl font-bold">Bookmarks</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </div>
            <div className="relative py-2 flex justify-between items-center">
              {bookmarks.length > 0 && (
                <div
                  onClick={() => setModal(true)}
                  className="w-9 h-9 flex group items-center justify-center rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
                >
                  <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
                </div>
              )}
            </div>
            <div
              onClick={clearAllBookmarks}
              className={`${
                modal
                  ? "flex flex-col absolute right-3 top-3 bg-white shadow-lg border rounded-lg z-50 text-red-600 p-4 hover:bg-neutral-50 transition ease-in-out cursor-pointer duration-200"
                  : "hidden"
              }`}
            >
              Clear all Bookmarks
            </div>
          </div>

          {bookmarks.length > 0 ? (
            <div className="relative">
              <div className="absolute z-10 w-44 bottom-0 left-2/3 text-white bg-blue-500 rounded transition ease-in-out duration-200">
                {notification !== null ? notification : null}
              </div>

              {bookmarks.map((post) => (
                <div key={post.id} className={`${post.isPinned && "pt-2"}`}>
                  <div className="relative p-5 w-full flex hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 border-b">
                    {post.commentModal ? (
                      <CommentModal
                        post={post}
                        createPost={createPost}
                        input={input}
                        handleInputChange={handleInputChange}
                        handleCloseCommentModal={handleCloseCommentModal}
                        refresh={fetchBookmarks}
                      />
                    ) : null}
                    {post.avatar === "" ? (
                      // <UserCircleIcon className="h-16 w-16" />

                      <img
                        onClick={() => routeUserDetails(post.username)}
                        className="h-12 w-12 rounded-full object-cover"
                        src="https://picsum.photos/200"
                        alt="Profile Image"
                      />
                    ) : (
                      <img
                        onClick={() => routeUserDetails(post.username)}
                        src={post.avatar}
                        alt="Profile Image"
                        className="mt-1 my-2
                     object-cover h-12 w-12 rounded-full"
                      />
                    )}

                    <div className="ml-3 w-full ">
                      <div className="flex justify-between items-center relative">
                        <div className="flex items-center">
                          <div className="font-semibold mr-1">{post.name}</div>
                          <div className="text-gray-500 mr-1.5">
                            @{post.username}
                          </div>
                          <div className="h-0.5 w-0.5 rounded-full bg-gray-500 mr-1.5"></div>

                          <div className="text-gray-500">
                            <LastSeen
                              date={new Date(post.timestamp.seconds * 1000)}
                            />
                          </div>
                        </div>

                        <div
                          onClick={() => openModal(post.id)}
                          className="w-9 h-9 flex group items-center justify-center absolute right-0 rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
                        >
                          <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
                        </div>
                        {post.modal ? (
                          <div
                            onClick={closeModal}
                            className="bg-transparent cursor-default fixed top-0 bottom-0 left-0 right-0 opacity-40 w-screen h-screen z-50"
                          ></div>
                        ) : null}
                        <div
                          className={`${
                            post.modal
                              ? "flex flex-col w-3/5 absolute right-0 top-0 bg-white shadow-lg rounded-lg z-50"
                              : "hidden"
                          }`}
                        >
                          <div>
                            {user.id === post.uid ? (
                              <div
                                onClick={() => handleDeletePost(post.id)}
                                className="flex items-center text-red-400 p-2 hover:bg-gray-100"
                              >
                                {" "}
                                <TrashIcon className="h-5 w-5 mr-3" /> Delete
                              </div>
                            ) : null}
                          </div>
                          <PinListItem post={post} />
                          <div>
                            {post.authIsFollowing === true ? (
                              <div
                                onClick={() => followOrUnfollowUser(post)}
                                className=" flex items-center rounded-md p-2 hover:bg-gray-100"
                              >
                                <UserRemoveIcon className="h-5 w-5 mr-3" />{" "}
                                Unfollow @{post.username}
                              </div>
                            ) : post.authIsFollowing === false ? (
                              <div
                                onClick={() => followOrUnfollowUser(post)}
                                className=" flex items-center rounded-md p-2 hover:bg-gray-100"
                              >
                                <UserAddIcon className="h-5 w-5 mr-3" /> Follow
                                @{post.username}
                              </div>
                            ) : (
                              user.id === post.uid && null
                            )}
                          </div>
                          <div></div>
                          <div>
                            {user.id !== post.uid && (
                              <div className="flex items-center p-2 hover:bg-gray-100">
                                <BanIcon className="h-5 w-5 mr-3" /> Block @
                                {post.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        {post.postType === "comment" ? (
                          <div className="mr-1">Replying to </div>
                        ) : null}
                        <div className="flex items-center">
                          {" "}
                          {removeDuplicateUsernames(post.replyToUsers).map(
                            (user) => (
                              <div className="tweet__userWhoReplied flex items-center text-blue-500">
                                <div
                                  // onClick={() => handleUserDetails(user.username)}
                                  className="mr-1 hover:underline"
                                  key={user.username}
                                >
                                  @{user?.username}
                                </div>{" "}
                                <div className="username mr-1">and</div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div
                        onClick={() => routeTweetDetails(post.id)}
                        className="mb-4 "
                      >
                        {post.message}
                      </div>
                      {post.media !== "" ? (
                        <img
                          src={post.media}
                          alt=""
                          className="w-full ml-0 mb-1 rounded-lg object-cover shadow-sm"
                        />
                      ) : null}
                      <div className="relative flex items-center justify-between">
                        <div
                          onClick={() => handleOpenBookmarkModal(post.id)}
                          className="flex cursor-pointer items-center space-x-3 text-gray-400"
                        >
                          <ChatAlt2Icon className="h-5 w-5" />
                          <p className="text-sm">
                            {post.comments.length === 0
                              ? null
                              : post.comments.length}
                          </p>
                        </div>
                        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
                          <SwitchHorizontalIcon className={`h-5 w-5 `} />
                        </div>
                        <div
                          onClick={() => toggleLikeBookmark(post.id)}
                          className={`flex cursor-pointer items-center space-x-3 text-${
                            post.isLiked ? "red" : "gray"
                          }-400`}
                        >
                          <div className="flex items-center group">
                            <div className="w-9 mr-1 h-9 group-hover:bg-red-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200">
                              <HeartIcon
                                fill={post.isLiked ? "red" : "transparent"}
                                className="h-5 w-5 rounded-full group-hover:bg-red-100 group-hover:text-red-500 transition ease-in-out cursor-pointer duration-200"
                              />
                            </div>
                            <p className="text-sm group-hover:text-red-500 transition ease-in-out cursor-pointer duration-200">
                              {post.likes?.length === 0
                                ? ""
                                : post.likes?.length}
                            </p>
                          </div>
                        </div>

                        <div onClick={() => removeBookmark(post.id)}>
                          <BookmarkButton
                            handleAddBookmark={() => false}
                            handleRemoveBookmark={() => removeBookmark(post.id)}
                            bookmarks={bookmarks}
                            post={post}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute top-15 w-1/2 left-1/4 overflow-visible">
              <img src={cageImage} alt="" />
              <div className="text-2xl font-bold">Save Tweets for later</div>
              <div className="text-gray-500">
                Don’t let the good ones fly away! Bookmark Tweets to easily find
                them again in the future.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Bookmarks;
