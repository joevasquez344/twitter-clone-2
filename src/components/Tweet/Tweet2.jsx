import React, { useState, useEffect } from "react";
import "../../styles/Tweet.css";
import {
  LocationMarkerIcon,
  TrashIcon,
  UserAddIcon,
  UserRemoveIcon,
} from "@heroicons/react/outline";
import { Tooltip } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import TweetFooter from "./TweetFooter";
import DefaultAvatar from "../DefaultAvatar";
import {
  handlePostIsLiked,
  handleReplyToUsernames,
} from "../../utils/handlers";
import MoreButton from "../Buttons/MoreButton";
import LastSeen from "../LastSeen";

const Tweet = ({
  id,
  handleLikePost,
  handleDeletePost,
  handleAddBookmark,
  handleRemoveBookmark,
  handlePinPost,
  handleUnpinPost,
  handleFollowUser,
  handleOpenCommentModal,
  isPinned,
  tabs,
  post,
  threadPost,
  bookmarks,
  post: {
    name,
    avatar,
    media,
    message,
    username,
    postType,
    timestamp,
    likes,
    uid,
    followers,
    replyToUsers,
  },
}) => {
  const { user, authsPinnedPost } = useSelector((state) => state.users);

  const [modal, setModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [authIsFollowing, setAuthIsFollowing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const pinPost = () => {
    handlePinPost(post);
    closeModal();
  };

  const unpinPost = () => {
    handleUnpinPost(post);
    closeModal();
  };

  const deletePost = () => {
    handleDeletePost(post.id);
    closeModal();
  };

  const addBookmark = async () => {
    handleAddBookmark(post.id, user.id);
  };

  const removeBookmark = async () => {
    handleRemoveBookmark(post.id, user.id);
  };

  const followUser = async () => {
    handleFollowUser(post);
    closeModal();
  };

  const handleTweetDetails = () => navigate(`/${username}/status/${id}`);
  const handleUserDetails = () => navigate(`/${username}`);

  useEffect(() => {
    handlePostIsLiked(likes, setIsLiked, user);
  }, [likes?.length]);

  useEffect(() => {
    const match = followers.find((u) => u.id === user.id);

    if (match) {
      setAuthIsFollowing(true);
    } else {
      setAuthIsFollowing(false);
    }
  }, [followers]);

  const tweetsFeedActive =
    tabs?.find((tab) => tab.isActive && tab.text === "Tweets") &&
    location.pathname !== "/home";

  const authUsersPost = user.id === uid;

  return (
    <div className="relative sm:hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200">
      <div
        className={`${
          isPinned && tweetsFeedActive ? "pt-2 relative" : "relative"
        } ${threadPost && "py-0"}`}
      >
        <div
          className={`px-4 relative ${
            !threadPost ? "pt-2 sm:pb-2 sm:pt-4" : "pt-0"
          } w-full flex  ${threadPost === true ? "" : "border-b"} `}
        >
          <div className=" relative">
            {avatar === null || avatar === "" ? (
              <div className="relative h-full">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center z-100">
                  <div className="h-16 w-16 rounded-full flex justify-center items-center">
                    <DefaultAvatar name={name} username={username} />
                  </div>
                </div>
                {threadPost && (
                  <hr className="absolute left-1/2 h-full border border-gray" />
                )}
              </div>
            ) : (
              <div className="relative h-full">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-100">
                  <div className="h-16 w-16 rounded-full flex justify-center items-center">
                    <img
                      onClick={handleUserDetails}
                      src={avatar}
                      alt="Profile Image"
                      className={` ${isPinned && "my-1"} ${
                        threadPost && " my-2"
                      } object-cover h-12 w-12 rounded-full`}
                    />
                  </div>
                </div>

                {threadPost && (
                  <hr className="absolute left-1/2 h-full border border-gray" />
                )}
              </div>
            )}
          </div>

          <div className={`ml-3 w-full ${threadPost && "mt-2"}`}>
            {isPinned && tweetsFeedActive ? (
              <div className="absolute top-0 flex text-gray-500 font-semibold text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-1 text-sm">Pinned Tweet</div>
              </div>
            ) : null}

            <div className="relative flex justify-between items-center">
              <div className={`flex items-center ${isPinned && "mt-1"}`}>
                <div className="font-semibold mr-1">{name}</div>
                <div className="text-gray-500 text-sm sm:text-base mr-1.5">@{username}</div>
                <div className="h-0.5 w-0.5 rounded-full bg-gray-500 mr-1.5"></div>
                <div className="text-gray-500 text-sm sm:text-base">
                  <LastSeen date={new Date(timestamp.seconds * 1000)} />
                </div>
              </div>

              <MoreButton openModal={openModal} />
              {modal ? (
                <div
                  onClick={closeModal}
                  className="bg-transparent cursor-default fixed top-0 bottom-0 left-0 right-0 opacity-40 w-screen h-screen z-50"
                ></div>
              ) : null}
              <div
                className={`${
                  modal
                    ? "flex flex-col w-3/5 absolute right-0 top-0 bg-white shadow-lg z-50"
                    : "hidden"
                }`}
              >
                <div>
                  {user.id === uid ? (
                    <div
                      onClick={deletePost}
                      className="flex items-center text-red-400 p-4 hover:bg-gray-100"
                    >
                      {" "}
                      <TrashIcon className="h-5 w-5 mr-3" /> Delete
                    </div>
                  ) : (
                    <>
                      {authIsFollowing ? (
                        <div
                          onClick={followUser}
                          className=" flex items-center p-4 hover:bg-gray-100"
                        >
                          <UserRemoveIcon className="h-5 w-5 mr-3" /> Unfollow @
                          {username}
                        </div>
                      ) : (
                        <div
                          onClick={followUser}
                          className=" flex items-center p-4 hover:bg-gray-100"
                        >
                          <UserAddIcon className="h-5 w-5 mr-3" /> Follow @
                          {username}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div>
                  {authUsersPost && (
                    <div>
                      {authsPinnedPost?.id === post.id ? (
                        <div
                          onClick={unpinPost}
                          className="flex items-center p-4 hover:bg-gray-100"
                        >
                          <LocationMarkerIcon className="h-5 w-5 mr-3" /> Unpin
                          Post
                        </div>
                      ) : (
                        <div
                          onClick={pinPost}
                          className="flex items-center p-4 hover:bg-gray-100"
                        >
                          <LocationMarkerIcon className="h-5 w-5 mr-3" /> Pin
                          Post
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {postType === "comment" ? (
                <div className="mr-1 text-gray-500 text-sm sm:text-base">Replying to </div>
              ) : null}
              <div className="flex items-center">
                {" "}
                {replyToUsers?.length === 0 && postType === "comment" ? (
                  <Tooltip
                    className="p-1 rounded-sm text-xs bg-gray-500"
                    placement="bottom"
                    content="Unknown user"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 1 },
                    }}
                  >
                    <div className="text-blue-500 cursor-text">user</div>
                  </Tooltip>
                ) : null}
                {handleReplyToUsernames(replyToUsers, post).map((username) => (
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
                ))}
              </div>
            </div>

            <div onClick={handleTweetDetails} className="mb-2 sm:mb-4">
              {message}
            </div>
            {media !== "" ? (
              <img
                onClick={handleTweetDetails}
                src={media}
                alt=""
                className="max-w-full ml-0 mb-2 rounded-xl object-cover"
              />
            ) : null}

            <TweetFooter
              isLiked={isLiked}
              handleLikePost={handleLikePost}
              handleAddBookmark={addBookmark}
              handleRemoveBookmark={removeBookmark}
              bookmarks={bookmarks}
              handleOpenCommentModal={handleOpenCommentModal}
              post={post}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
