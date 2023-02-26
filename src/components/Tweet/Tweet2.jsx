import React, { useState, useEffect, useRef } from "react";
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
import TweetPopup from "./TweetPopup";
import TweetAvatar from "./TweetAvatar";
import TweetReplyTo from "./TweetReplyTo";
import TweetHeader from "./TweetHeader";

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

  const avatarRef = useRef(null);
  const topRef = useRef(null);
  const replyToRef = useRef(null);
  const midRef = useRef(null);
  const moreRef = useRef(null);
  const commentRef = useRef(null);
  const retweetRef = useRef(null);
  const likeRef = useRef(null);
  const bookmarkRef = useRef(null);

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
    <div className="sm:hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200">
      <div
        className={`${
          isPinned && tweetsFeedActive ? "pt-4 relative" : "relative"
        } ${threadPost && "pb-2 pt-3"}`}
      >
        <div
          className={`relative px-2 sm:px-4 flex overflow-visible ${
            !threadPost ? "pt-2 sm:pb-1 sm:pt-3" : "pt-0"
          }   ${threadPost === true ? "" : "border-b"}`}
        >
          <TweetAvatar
            avatar={avatar}
            name={name}
            username={username}
            threadPost={threadPost}
            isPinned={isPinned}
          />

          <div className="relative w-full min-w-0 ">
            <MoreButton openModal={openModal} />
            <TweetPopup
              openModal={openModal}
              modal={modal}
              closeModal={closeModal}
              uid={post.uid}
              deletePost={deletePost}
              followUser={followUser}
              postUsername={post.username}
              authIsFollowing={authIsFollowing}
              authUsersPost={authUsersPost}
              authsPinnedPost={authsPinnedPost}
              post={post}
              unpinPost={unpinPost}
              pinPost={pinPost}
            />

            <div
              onClick={
                postType === "comment"
                  ? null
                  : () => navigate(`/${username}/status/${id}`)
              }
              className={`${threadPost && "mt-2"} ml-3`}
            >
              {isPinned && tweetsFeedActive ? (
                <div className="absolute -top-4 flex text-sm text-gray-500 font-semibold">
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

              <TweetHeader
                name={name}
                username={username}
                timestamp={timestamp}
                isPinned={isPinned}
              />

              <TweetReplyTo
                postType={postType}
                replyToUsers={replyToUsers}
                handleReplyToUsernames={handleReplyToUsernames}
                post={post}
              />

              <div
                onClick={handleTweetDetails}
                className="mb-2 inline-block w-full break-words text-gray-700"
              >
                {message}
              </div>
              {media !== "" ? (
                <img
                  onClick={handleTweetDetails}
                  src={media}
                  alt=""
                  className="ml-0 mb-2 w-full rounded-xl object-cover"
                />
              ) : null}
            </div>
            <TweetFooter
              isLiked={isLiked}
              handleLikePost={handleLikePost}
              handleAddBookmark={addBookmark}
              handleRemoveBookmark={removeBookmark}
              bookmarks={bookmarks}
              handleOpenCommentModal={handleOpenCommentModal}
              post={post}
              ref={midRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
