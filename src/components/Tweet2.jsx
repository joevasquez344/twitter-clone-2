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
import { useNavigate } from "react-router-dom";
import { refreshPost } from "../redux/home/home.actions";
import { followUser, unfollowUser } from "../utils/api/users";

const Tweet = ({
  id,
  handleLikePost,
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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleIsLiked = () => {
    const liked = likes?.find((like) => like.id === user.id);

    if (liked) setIsLiked(true);
    else setIsLiked(false);
  };


  const followPostUser = async () => {
    await followUser(uid, user.id);
    dispatch(refreshPost(id));
    closeModal();
  };
  const unfollowPostUser = async () => {
    await unfollowUser(uid, user.id);

    closeModal();
  };

  const handleIsFollowing = () => {
    const match = followers?.find((follower) => follower.id === user.id);

    if (match) {
      return (
        <div
          onClick={() => unfollowPostUser()}
          className=" flex items-center rounded-md p-2 hover:bg-gray-100"
        >
          <UserRemoveIcon className="h-5 w-5 mr-3" /> Unfollow @{username}
        </div>
      );
    } else {
      return (
        <div
          onClick={() => followPostUser()}
          className=" flex items-center rounded-md p-2 hover:bg-gray-100"
        >
          <UserAddIcon className="h-5 w-5 mr-3" /> Follow @{username}
        </div>
      );
    }
  };

  const handleTweetDetails = () =>
    navigate(`/${name}/status/${id}`, { state: { id, type: "tweet" } });

  const handleUserDetails = (username) => navigate(`/${username}`);

  useEffect(() => {
    handleIsLiked();

    setLoading(false);
  }, [likes?.length]);

  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
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
            <img onClick={handleUserDetails} src={avatar} alt="Profile Image" />
          )}

          <div className="ml-3 w-full">
            <div className="flex justify-between relative">
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
                    <div className="flex items-center text-red-400 p-2 hover:bg-gray-100">
                      {" "}
                      <TrashIcon className="h-5 w-5 mr-3" /> Delete
                    </div>
                  ) : (
                    <>{handleIsFollowing()}</>
                  )}
                </div>
                <div>
                  {user.id === uid && (
                    <div className="flex items-center p-2 hover:bg-gray-100">
                      <LocationMarkerIcon className="h-5 w-5 mr-3" /> Pin to
                      your profile
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
