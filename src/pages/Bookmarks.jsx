import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import cageImage from "../images/cage.png";
import { Tooltip } from "@material-tailwind/react";

import {
  fetchBookmarks,
  toggleLikePost,
  clearBookmarks,
  deleteBookmarkById,
  deletePostById,
  addBookmarkById,
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
import TweetAvatar from "../components/Tweet/TweetAvatar";
import MoreButton from "../components/Buttons/MoreButton";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkIds, setBookmarkIds] = useState([]);
  const [modal, setModal] = useState(false);
  const user = useSelector((state) => state.users.user);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const getBookmarks = async () => {
    let bookmarks = await fetchBookmarks(user.id);

    bookmarks.map((post) => {
      const userLiked = post.likes.find((uid) => uid === user.id);
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
    setBookmarkIds(bookmarks.map((post) => post.id));

    setLoading(false);
  };

  const toggleLikeBookmark = async (postId) => {
    const likes = await toggleLikePost(postId);

    const updatedBookmarks = bookmarks.map((post) => {
      if (post.id === postId) {
        post.likes = likes;
        const userLiked = post.likes.find((uid) => uid === user.id);
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
          bookmark.modal = false;
          bookmark.authIsFollowing = false;

          return bookmark;
        });

        setBookmarks(updatedBookmarks);
      } else {
        const { followers } = await followUser(post.uid, user.id);
        const updatedBookmarks = bookmarks.map((bookmark) => {
          bookmark.followers = followers;
          bookmark.modal = false;
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

  const addBookmark = async (postId) => {
    await addBookmarkById(postId, user.id);

    setBookmarkIds([...bookmarkIds, postId]);
  };

  const removeBookmark = async (postId) => {
    await deleteBookmarkById(postId, user.id);

    const updatedBookmarkIds = bookmarkIds.filter(
      (bookmarkId) => bookmarkId !== postId
    );

    setBookmarkIds(updatedBookmarkIds);
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

    getBookmarks();
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

  const routeTweetDetails = async (post) => {
    navigate(`/${post.username}/status/${post.id}`);
  };
  const routeUserDetails = async (username) => {
    navigate(`/${username}`);
  };

  useEffect(() => {
    getBookmarks();
  }, []);

  console.log("Bookmarks: ", bookmarks);

  // const bookmarkIds = bookmarks.map((post) => post.id)

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative">
          {modal ? (
            <div
              onClick={() => setModal(false)}
              className="bg-transparent cursor-default fixed top-0 bottom-0 left-0 right-0 opacity-40 w-screen h-screen z-40"
            ></div>
          ) : null}
          <div className="z-40 sticky top-0 bg-white p-4 flex justify-between items-center">
            <div>
              <div className="sm:text-xl font-bold">Bookmarks</div>
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
                  ? "flex flex-col absolute right-3 top-3 bg-white shadow-lg border rounded-lg z-40 text-red-600 p-4 hover:bg-neutral-50 transition ease-in-out cursor-pointer duration-200"
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
                <div key={post.id}>
                  <div className="relative px-4 pt-2 sm:pb-1 sm:pt-3 w-full flex overflow-hidden hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 border-b">
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
                    <TweetAvatar
                      avatar={post.avatar}
                      name={post.name}
                      username={post.username}
                      threadPost={false}
                      isPinned={false}
                    />

                    <div className="ml-3 w-full relative min-w-0">
                      <MoreButton openModal={() => openModal(post.id)} />
                      <>
                        {post.modal ? (
                          <div
                            onClick={closeModal}
                            className="bg-transparent cursor-default fixed top-0 bottom-0 left-0 right-0 opacity-40 w-screen h-screen z-50"
                          ></div>
                        ) : null}
                        <div
                          className={`${
                            post.modal
                              ? "flex flex-col w-3/5 absolute right-0 top-0 bg-white shadow-xl z-50 font-bold"
                              : "hidden"
                          }`}
                        >
                          {user.id === post.uid && (
                            <div
                              onClick={() => handleDeletePost(post.id)}
                              className="flex items-center text-red-400 p-3 hover:bg-gray-100"
                            >
                              {" "}
                              <TrashIcon className="h-5 w-5 mr-3" /> Delete
                            </div>
                          )}

                          <PinListItem post={post} closeModal={closeModal} />

                          {user.id === post.uid ? null : (
                            <div className="">
                              {post.authIsFollowing === true ? (
                                <div
                                  onClick={() => followOrUnfollowUser(post)}
                                  className="flex items-center p-3 hover:bg-gray-100"
                                >
                                  <UserRemoveIcon className="h-5 w-5 mr-3" />{" "}
                                  Unfollow @{post.username}
                                </div>
                              ) : post.authIsFollowing === false ? (
                                <div
                                  onClick={() => followOrUnfollowUser(post)}
                                  className="flex items-center p-3 hover:bg-gray-100"
                                >
                                  <UserAddIcon className="h-5 w-5 mr-3" />{" "}
                                  Follow @{post.username}
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </>
                      <div className="" onClick={() => routeTweetDetails(post)}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="font-semibold mr-1">
                              {post.name}
                            </div>
                            <div className="text-gray-500 text-sm sm:text-base mr-1.5">
                              @{post.username}
                            </div>
                            <div className="h-0.5 w-0.5 rounded-full bg-gray-500 mr-1.5"></div>

                            <div className="text-gray-500">
                              <LastSeen
                                date={new Date(post.timestamp.seconds * 1000)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex">
                          {post.postType === "comment" ? (
                            <div className="mr-1 text-gray-500">
                              Replying to{" "}
                            </div>
                          ) : null}
                          {post.replyToUsers?.length === 0 &&
                          post.postType === "comment" ? (
                            <div className="text-blue-500">@User</div>
                          ) : null}
                          <div className="flex items-center">
                            {" "}
                            {removeDuplicateUsernames(post.replyToUsers).map(
                              (username) => (
                                <div className="tweet__userWhoReplied flex items-center text-blue-500">
                                  <div
                                    onClick={() => navigate(`/${username}`)}
                                    className="mr-1 hover:underline"
                                    key={username}
                                  >
                                    @{username}
                                  </div>{" "}
                                  <div className="username mr-1">and</div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div
                          onClick={() => routeTweetDetails(post)}
                          className=" mb-2 inline-block w-full break-words"
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
                      </div>

                      <div className="relative flex items-center justify-between">
                        <Tooltip
                          className="hidden sm:flex p-1 rounded-sm text-xs bg-gray-500"
                          placement="bottom"
                          content="Reply"
                          animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0, y: 1 },
                          }}
                        >
                          <div
                            onClick={() => handleOpenBookmarkModal(post.id)}
                            className="flex group cursor-pointer items-center text-gray-400"
                          >
                            <div className="w-9 sm:mr-1 h-9 group-hover:bg-blue-100 flex items-center rounded-full justify-center transition ease-in-out cursor-pointer duration-200">
                              <ChatAlt2Icon
                                fill={"transparent"}
                                className="w-4 h-4 sm:h-5 sm:w-5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-400 transition ease-in-out cursor-pointer duration-200"
                              />
                            </div>
                            <p className="text-sm">
                              {post.comments.length === 0
                                ? null
                                : post.comments.length}
                            </p>
                          </div>
                        </Tooltip>
                        <Tooltip
                          className=" p-1 rounded-sm text-xs bg-gray-500"
                          placement="bottom"
                          content="Retweet feature coming soon"
                          animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0, y: 1 },
                          }}
                        >
                          <div className="flex group cursor-pointer items-center space-x-3 text-gray-400">
                            <div className="w-9 mr-1 h-9 sm:group-hover:bg-green-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200">
                              <SwitchHorizontalIcon
                                fill={"transparent"}
                                className="h-4 w-4 sm:h-5 sm:w-5 rounded-full sm:group-hover:bg-green-100 sm:group-hover:text-green-400 transition ease-in-out cursor-pointer duration-200"
                              />
                            </div>
                          </div>
                        </Tooltip>
                        <Tooltip
                          className="hidden sm:flex p-1 rounded-sm text-xs bg-gray-500"
                          placement="bottom"
                          content={post.isLiked ? "Unlike" : "Like"}
                          animate={{
                            mount: { scale: 1, y: 0 },
                            unmount: { scale: 0, y: 1 },
                          }}
                        >
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
                        </Tooltip>

                        <BookmarkButton
                          handleAddBookmark={() => addBookmark(post.id)}
                          handleRemoveBookmark={() => removeBookmark(post.id)}
                          bookmarks={bookmarkIds}
                          post={post}
                        />
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
