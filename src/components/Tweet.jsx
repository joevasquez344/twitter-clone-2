import React, { useState, useEffect } from "react";
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
  DotsHorizontalIcon,
  UserCircleIcon,
  LocationMarkerIcon,
  TrashIcon,
  UserAddIcon,
  UserRemoveIcon,
} from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { refreshPost, toggleLikePost } from "../redux/home/home.actions";
import { followUser, unfollowUser } from "../utils/api/users";

const Tweet = ({
  id,
  likeTweet,
  stateType,
  tweet: {
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
  },
}) => {
  const user = useSelector((state) => state.users.user);
  const [modal, setModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleIsLiked = () => {
    const liked = likes?.find((like) => like.id === user.id);

    if (liked) setIsLiked(true);
    else setIsLiked(false);
  };

  // This function wont work on the home tweet feed due to not having the dispatch function attached
  // const handleLikeTweet = () => likeTweet(id, postType);

  // const handleLikePost = () => dispatch(toggleLikePost(id, user.id));
  const handleLikePost = () => {
    if (stateType === "redux") {
      dispatch(toggleLikePost(id, user.id));
    } else if (stateType === "local") {
      likeTweet(id);
    }
  };

  const followPostUser = async () => {
    await followUser(uid, user.id);
    dispatch(refreshPost(id));
    closeModal();
  };
  const unfollowPostUser = async () => {
    await unfollowUser(uid, user.id);
    dispatch(refreshPost(id));
    closeModal();

  };

  const handleIsFollowing = () => {
    const match = followers?.find((follower) => follower.id === user.id);

    if (match) {
      return (
        <div
          onClick={() => unfollowPostUser()}
          className=" flex rounded-md p-2 hover:bg-gray-100"
        >
          <UserRemoveIcon className="h-5 w-5 mr-2" /> Unfollow
        </div>
      );
    } else {
      return (
        <div
          onClick={() => followPostUser()}
          className=" flex rounded-md p-2 hover:bg-gray-100"
        >
          <UserAddIcon className="h-5 w-5 mr-2" /> Follow
        </div>
      );
    }
  };

  const handleTweetDetails = () =>
    navigate(`/${name}/status/${id}`, { state: { id, type: "tweet" } });

  const handleUserDetails = () => navigate(`/${username}`);

  useEffect(() => {
    handleIsLiked();

    setLoading(false);
  }, [likes.length]);
  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="relative p-5 w-full flex hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 border-b">
          {avatar === "" ? (
            // <UserCircleIcon className="h-16 w-16" />
            <img
              onClick={handleUserDetails}
              className="h-12 w-12 rounded-full object-cover"
              src="https://picsum.photos/200"
              alt="Profile Image"
            />
          ) : (
            <img onClick={handleUserDetails} src={avatar} alt="Profile Image" />
          )}

          <div className="ml-3 w-full">
            <div className="flex justify-between relative">
              <div className="flex">
                <div className="font-semibold mr-2">{name}</div>
                <div className="text-gray-500">@{username}</div>
                <div>Date</div>
              </div>
              <DotsHorizontalIcon onClick={openModal} className="h-5 w-5" />
              <div
                className={`${
                  modal
                    ? "flex flex-col absolute right-0 top-0 bg-white shadow-lg rounded-lg z-50"
                    : "hidden"
                }`}
              >
                <div>
                  {user.id === uid ? (
                    <div className="flex text-red-400 p-2 hover:bg-gray-100">
                      {" "}
                      <TrashIcon className="h-5 w-5 mr-2" /> Delete
                    </div>
                  ) : (
                    <>{handleIsFollowing()}</>
                  )}
                </div>
                <div>
                  {user.id === uid && (
                    <div className="flex p-2 hover:bg-gray-100">
                      <LocationMarkerIcon className="h-5 w-5 mr-2" /> Pin to
                      your profile
                    </div>
                  )}
                </div>
                <div>
                  {user.id !== uid && (
                    <div className="p-2 hover:bg-gray-100">
                      Block @${username}
                    </div>
                  )}
                </div>
                <div onClick={closeModal} className="p-2 hover:bg-gray-100">
                  Close
                </div>
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
                onClick={handleLikePost}
                className={`flex cursor-pointer items-center space-x-3 text-${
                  isLiked ? "red" : "gray"
                }-400`}
              >
                <HeartIcon
                  fill={isLiked ? "red" : "transparent"}
                  className="h-5 w-5"
                />
                <p className="text-sm">
                  {likes?.length === 0 ? "" : likes?.length}
                </p>
              </div>
              <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
                <UploadIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tweet;
