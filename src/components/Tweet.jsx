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
import { refreshPost, likePost } from "../redux/home/home.actions";
import { followUser, unfollowUser } from "../utils/api/users";
import { likeComment } from "../redux/tweet-details/tweet-details.actions";
import { pinPost, unpinPost } from "../utils/api/posts";

const Tweet = ({
  id,
  likeTweet,
  stateType,
  pinnedPost,
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
    replyToUsers,
  },
}) => {
  const user = useSelector((state) => state.users.user);
  const userDetails = useSelector((state) => state.users.userDetails);
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
      dispatch(likePost(id, user.id));
    } else if (stateType === "local") {
      likeTweet(id);
    } else if (stateType === "redux-comments") {
      dispatch(likeComment(id));
    } else if (stateType === "redux-repliedToPosts") {
      dispatch(likeTweet(id));
    }
  };

  const handlePinnedPostDisplay = () => {
    if (!userDetails.pinnedPost?.id) {
      return (
        <div
          onClick={() => pinPost(id, user.id)}
          className="flex items-center p-2 hover:bg-gray-100"
        >
          <LocationMarkerIcon className="h-5 w-5 mr-3" /> Pin to your profile
        </div>
      );
    } else {
      return (
        <div
          onClick={() => unpinPost(id, user.id)}
          className="flex items-center p-2 hover:bg-gray-100"
        >
          <LocationMarkerIcon className="h-5 w-5 mr-3" /> Unpin to your profile
        </div>
      );
    }
    // if (userDetails.pinnedPost.id === id) {
    //   if (userDetails.pinnedPost === null) {
    //   } else {
    //   }
    // }
  };

  const followPostUser = async () => {
    await followUser(uid, user.id);
    dispatch(refreshPost(id));
    closeModal();
  };
  const unfollowPostUser = async () => {
    await unfollowUser(uid, user.id);
    if (stateType === "redux") {
      dispatch(refreshPost(id));
    } else if (stateType === "local") {
      // const post = await getPostById(postId);
    }

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
        <div className={`${pinnedPost && "pt-2"}`}>
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
              {pinnedPost && (
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
              )}

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
                    {user.id === uid && handlePinnedPostDisplay(id, user.id)}
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
                  onClick={handleLikePost}
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
        </div>
      )}
    </>
  );
};

export default Tweet;
