import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tweet from "../components/Tweet2";
import cageImage from "../images/cage.png";
import {
  getBookmarks,
  toggleLikePost,
  clearBookmarks,
} from "../utils/api/posts";
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
} from "@heroicons/react/outline";
import {
  followUser,
  getProfileFollowers,
  unfollowUser,
} from "../utils/api/users";
import Loader from "../components/Loader";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [modal, setModal] = useState(false);
  const user = useSelector((state) => state.users.user);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    let bookmarks = await getBookmarks(user.id);

    bookmarks.map((post) => {
      const userLiked = post.likes.find((u) => u.id === user.id);
      if (userLiked) {
        post.isLiked = true;
      } else {
        post.isLiked = false;
      }

      if (post.uid === user.id) {
        return null;
      } else {
        const isFollowing = post.followers.find((u) => u.id === user.id);
        if (isFollowing) {
          post.authIsFollowing = true;
        } else {
          post.authIsFollowing = false;
        }
      }

      post.modal = false;

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
      const followers = await getProfileFollowers(post.uid);

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

  const removeBookmark = async () => {};

  const deletePost = async () => {};

  const createComment = async () => {};

  const openModal = (postId) => {
    const updatedBookmarks = bookmarks.map((post) => {
      post.modal = false;

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
      if (post.id === postId) {
        post.modal = false;
      }

      return post;
    });

    setBookmarks(updatedBookmarks);
  };

  const routeTweetDetails = async () => {};
  const routeUserDetails = async () => {};

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
          <div className="relative px-5 py-2 flex justify-between items-center">
            <div>
              <div className="text-xl font-bold">Bookmarks</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </div>
            {bookmarks.length > 0 && (
              <div
                onClick={() => setModal(true)}
                className="w-9 h-9 flex group items-center justify-center rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
              >
                <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
              </div>
            )}
            <div
              onClick={clearAllBookmarks}
              className={`${
                modal
                  ? "flex flex-col absolute right-0 top-0 bg-white shadow-lg rounded-lg z-50"
                  : "hidden"
              }`}
            >
              Clear All
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
                    {post.avatar === "" ? (
                      // <UserCircleIcon className="h-16 w-16" />

                      <img
                        // onClick={() => handleUserDetails(username)}
                        className="h-12 w-12 rounded-full object-cover"
                        src="https://picsum.photos/200"
                        alt="Profile Image"
                      />
                    ) : (
                      <img
                        // onClick={handleUserDetails}
                        src={post.avatar}
                        alt="Profile Image"
                      />
                    )}

                    <div className="ml-3 w-full ">
                      <div className="flex justify-between relative">
                        <div className="flex">
                          <div className="font-semibold mr-2">{post.name}</div>
                          <div className="text-gray-500">@{post.username}</div>
                          <div>Date</div>
                        </div>

                        <div
                          onClick={() => openModal(post.id)}
                          className="w-9 h-9 flex group items-center justify-center absolute right-0 rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
                        >
                          <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
                        </div>
                        <div
                          className={`${
                            post.modal
                              ? "flex flex-col absolute right-0 top-0 bg-white shadow-lg rounded-lg z-50"
                              : "hidden"
                          }`}
                        >
                          <div>
                            {user.id === post.uid ? (
                              <div className="flex items-center text-red-400 p-2 hover:bg-gray-100">
                                {" "}
                                <TrashIcon className="h-5 w-5 mr-3" /> Delete
                              </div>
                            ) : null}
                          </div>
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
                          <div>
                            {/* {user.id === uid && handlePinnedPostDisplay(id, user.id)} */}
                          </div>
                          <div>
                            {user.id !== post.uid && (
                              <div className="flex items-center p-2 hover:bg-gray-100">
                                <BanIcon className="h-5 w-5 mr-3" /> Block @
                                {post.username}
                              </div>
                            )}
                          </div>
                          <div
                            onClick={() => closeModal(post.id)}
                            className="flex items-center px-2 py-3 hover:bg-gray-100 border-t"
                          >
                            <XIcon className="h-5 w-5 mr-3" /> Close
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        {post.postType === "comment" ? (
                          <div className="mr-1">Replying to </div>
                        ) : null}
                        <div className="flex items-center">
                          {" "}
                          {post.replyToUsers?.map((user) => (
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
                          ))}
                        </div>
                      </div>

                      <div
                        //  onClick={handleTweetDetails}
                        className="mb-4 "
                      >
                        {post.message}
                      </div>
                      {/* 
     <img
       src="https://picsum.photos/200"
       className="w-full h-100 rounded-xl mb-4"
       alt="Media Content"
     /> */}
                      <div className="flex items-center justify-between">
                        <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
                          <ChatAlt2Icon className="h-5 w-5" />
                          <p className="text-sm">2</p>
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
                        <div
                          // onClick={handleAddBookmark}
                          className="flex cursor-pointer items-center space-x-3 text-gray-400"
                        >
                          <UploadIcon className="h-5 w-5" />
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
