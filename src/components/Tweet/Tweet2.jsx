import React, { useState, useEffect } from "react";
import "../../styles/Tweet.css";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { followUser, unfollowUser } from "../../utils/api/users";
import { addBookmark } from "../../utils/api/posts";
import TweetFooter from "./TweetFooter";
import DefaultAvatar from "../DefaultAvatar";
import CommentModal from "../CommentModal";
import { handlePostIsLiked } from "../../utils/handlers";
import { removeDuplicateUsernames } from "../../utils/helpers";
import MoreButton from "../Buttons/MoreButton";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";

const Tweet = ({
  id,
  handleLikePost,
  handleDeletePost,
  handlePinPost,
  handleUnpinPost,
  handleFollowUser,
  handleOpenCommentModal,
  isPinned,
  tabs,
  post,
  userDeletedPost,
  threadPost,

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
  const user = useSelector((state) => state.users.user);

  const [modal, setModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const pinPost = async () => {
    await handlePinPost(id);
    closeModal();
  };

  const unpinPost = async () => {
    await handleUnpinPost(id);
    closeModal();
  };

  const handleAddBookmark = async () => await addBookmark(id, user.id);

  const handleTweetDetails = () => navigate(`/${username}/status/${id}`);
  const handleUserDetails = (username) => navigate(`/${username}`);

  useEffect(() => {
    handlePostIsLiked(likes, setIsLiked, user);
  }, [likes?.length]);

  const tweetsFeedActive =
    tabs?.find((tab) => tab.isActive && tab.text === "Tweets") &&
    location.pathname !== "/home";

  const authUsersPost = user.id === uid;
  const authUserIsFollowingPostUser = followers?.find(
    (follower) => follower.id === user.id
  );

  return (
    <div className="relative z-0">
      <div
        className={`${
          isPinned && tweetsFeedActive ? "pt-2 relative" : "relative"
        }`}
      >
        <div
          className={` px-4 relative ${
            !threadPost ? "pb-2 pt-4" : "pt-0"
          } w-full flex hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 ${
            threadPost === true ? "" : "border-b"
          } `}
        >
          <div className=" relative">
            {avatar === "" ? (
              // <UserCircleIcon className="h-16 w-16" />
              <div className=" h-full flex flex-col ">
                <div className="rounded-full my-2 object-cover">
                  <DefaultAvatar name={name} username={username} />
                </div>

                <div className="flex justify-center items-center h-full w-full">
                  {threadPost && <hr className=" border h-full " />}
                </div>
              </div>
            ) : (
              // <img
              //   onClick={() => handleUserDetails(username)}
              //   className="h-12 w-12 rounded-full object-cover"
              //   src="https://picsum.photos/200"
              //   alt="Profile Image"
              // />
              <div className="relative">
                <img
                  onClick={handleUserDetails}
                  src={avatar}
                  alt="Profile Image"
                  className="z-50"
                />
                <hr className="absolute left-1/2 h-full border-x-2 border-gray" />
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
                <div className="ml-1">Pinned Tweet</div>
              </div>
            ) : null}

            <div className="flex justify-between items-center relative">
              <div className="flex">
                <div className="font-semibold mr-2">{name}</div>
                <div className="text-gray-500">@{username}</div>

                <div>Date</div>
              </div>

              <MoreButton openModal={openModal} />
              <div
                className={`${
                  modal
                    ? "flex flex-col absolute right-0 top-0 bg-white shadow-lg rounded-lg z-50"
                    : "hidden"
                }`}
              >
                <div>
                  {user.id === uid ? (
                    <div
                      onClick={() => handleDeletePost(id)}
                      className="flex items-center text-red-400 p-2 hover:bg-gray-100"
                    >
                      {" "}
                      <TrashIcon className="h-5 w-5 mr-3" /> Delete
                    </div>
                  ) : (
                    <>
                      {authUserIsFollowingPostUser ? (
                        <div
                          onClick={() =>
                            handleFollowUser({ followers, uid, id })
                          }
                          className=" flex items-center rounded-md p-2 hover:bg-gray-100"
                        >
                          <UserRemoveIcon className="h-5 w-5 mr-3" /> Unfollow @
                          {username}
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            handleFollowUser({ followers, uid, id })
                          }
                          className=" flex items-center rounded-md p-2 hover:bg-gray-100"
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
                      {isPinned ? (
                        <div
                          onClick={unpinPost}
                          className="flex items-center p-2 hover:bg-gray-100"
                        >
                          <LocationMarkerIcon className="h-5 w-5 mr-3" /> Unpin
                          to your profile
                        </div>
                      ) : (
                        <div
                          onClick={pinPost}
                          className="flex items-center p-2 hover:bg-gray-100"
                        >
                          <LocationMarkerIcon className="h-5 w-5 mr-3" /> Pin to
                          your profile
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  {user.id !== uid && (
                    <div className="flex items-center p-2 hover:bg-gray-100">
                      <BanIcon className="h-5 w-5 mr-3" /> Block @{username}
                    </div>
                  )}
                </div>
                <div
                  onClick={closeModal}
                  className="flex items-center px-2 py-3 hover:bg-gray-100 border-t"
                >
                  <XIcon className="h-5 w-5 mr-3" /> Close
                </div>
              </div>
            </div>

            <div className="flex">
              {postType === "comment" ? (
                <div className="mr-1 text-gray-500">Replying to </div>
              ) : null}
              <div className="flex items-center">
                {" "}
                {removeDuplicateUsernames(replyToUsers).map((username) => (
                  <div className="tweet__userWhoReplied flex items-center text-blue-500">
                    <div
                      onClick={() => handleUserDetails(username)}
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

            <div onClick={handleTweetDetails} className="mb-4 ">
              {message}
            </div>
            {media !== "" ? (
              <img
                src={media}
                alt=""
                className=" w-full ml-0 mb-2 rounded-lg object-cover"
              />
            ) : null}

            <TweetFooter
              likes={likes}
              isLiked={isLiked}
              handleLikePost={handleLikePost}
              handleAddBookmark={handleAddBookmark}
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
