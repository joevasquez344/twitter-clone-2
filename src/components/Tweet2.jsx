import React, { useState, useEffect } from "react";
import "../styles/Tweet.css";
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
import { followUser, unfollowUser } from "../utils/api/users";
import { addBookmark } from "../utils/api/posts";

const Tweet = ({
  id,
  fetchProfile,
  handleLikePost,
  handleRefreshPost,
  handleRefreshPosts,
  handlePinPost,
  handleUnpinPost,
  handleDeletePost,
  handleFollowPostUser,
  handleUnfollowPostUser,
  isPinned,
  tabs,
  post: {
    name,
    avatar,
    media,
    email,
    message,
    username,
    postType,
    timestamp,
    description,
    likes,
    uid,
    followers,
    replyToUsers,
  },
}) => {
  const user = useSelector((state) => state.users.user);

  const [modal, setModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const postIsLiked = () => {
    const liked = likes?.find((like) => like.id === user.id);

    if (liked) setIsLiked(true);
    else setIsLiked(false);
  };

  const followTweetUser = async () => {
    // await handleFollowPostUser(uid, user.id)
    await followUser(uid, user.id)
    // handleRefreshPost(id);
    
    fetchProfile();
    closeModal();
  };

  const unfollowTweetUser = async () => {
    // await handleUnfollowPostUser(uid, user.id)
    await unfollowUser(uid, user.id)
    // handleRefreshPost(id);

    fetchProfile();
    closeModal();
  };

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
    postIsLiked();

    setLoading(false);
  }, [likes?.length]);

  const tweetsFeedActive =
    tabs?.find((tab) => tab.isActive && tab.text === "Tweets") 
    &&
    location.pathname !== "/home";

  const authUsersPost = user.id === uid;
  const authUserIsFollowingPostUser = followers?.find(
    (follower) => follower.id === user.id
  );

  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className={`${isPinned && "pt-2"}`}>
          <div className="relative p-5 w-full flex hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 border-b">
            {avatar === "" ? (
              // <UserCircleIcon className="h-16 w-16" />

              <img
                onClick={() => handleUserDetails(username)}
                className="h-12 w-12 rounded-full object-cover"
                src="https://picsum.photos/200"
                alt="Profile Image"
              />
            ) : (
              <img
                onClick={handleUserDetails}
                src={avatar}
                alt="Profile Image"
              />
            )}

            <div className="ml-3 w-full ">
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

                <div
                  onClick={openModal}
                  className="w-9 h-9 flex group items-center justify-center absolute right-0 rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
                >
                  <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
                </div>
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
                            onClick={unfollowTweetUser}
                            className=" flex items-center rounded-md p-2 hover:bg-gray-100"
                          >
                            <UserRemoveIcon className="h-5 w-5 mr-3" /> Unfollow
                            @{username}
                          </div>
                        ) : (
                          <div
                            onClick={followTweetUser}
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
                            onClick={pinPost}
                            className="flex items-center p-2 hover:bg-gray-100"
                          >
                            <LocationMarkerIcon className="h-5 w-5 mr-3" /> Pin
                            to your profile
                          </div>
                        ) : (
                          <div
                            onClick={unpinPost}
                            className="flex items-center p-2 hover:bg-gray-100"
                          >
                            <LocationMarkerIcon className="h-5 w-5 mr-3" />{" "}
                            Unpin to your profile
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
                  <div className="mr-1">Replying to </div>
                ) : null}
                <div className="flex items-center">
                  {" "}
                  {replyToUsers?.map((user) => (
                    <div className="tweet__userWhoReplied flex items-center text-blue-500">
                      <div
                        onClick={() => handleUserDetails(user.username)}
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

              <div onClick={handleTweetDetails} className="mb-4 ">
                {message}
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
                  onClick={() => handleLikePost(id)}
                  className={`flex cursor-pointer items-center space-x-3 text-${
                    isLiked ? "red" : "gray"
                  }-400`}
                >
                  <div className="flex items-center group">
                    <div className="w-9 mr-1 h-9 group-hover:bg-red-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200">
                      <HeartIcon
                        fill={isLiked ? "red" : "transparent"}
                        className="h-5 w-5 rounded-full group-hover:bg-red-100 group-hover:text-red-500 transition ease-in-out cursor-pointer duration-200"
                      />
                    </div>
                    <p className="text-sm group-hover:text-red-500 transition ease-in-out cursor-pointer duration-200">
                      {likes?.length === 0 ? "" : likes?.length}
                    </p>
                  </div>
                </div>
                <div
                  onClick={handleAddBookmark}
                  className="flex cursor-pointer items-center space-x-3 text-gray-400"
                >
                  <UploadIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tweet;
