import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "@material-tailwind/react";

import cageImage from "../../images/cage.png";

import Modal from "../../components/Modal";
import Comments from "../../components/Comments";
import Tweet from "../../components/Tweet/Tweet2";

import { PhotographIcon } from "@heroicons/react/outline";

import Moment from "react-moment";
import "moment-timezone";

import {
  deletePost,
  getPostDetails,
  getThreadPosts,
  likeComment,
  likePostDetails,
  likeRepliedToPost,
  refreshPost,
  toggleFollowPostUser,
} from "../../redux/tweet-details/tweet-details.actions";

import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
  DotsHorizontalIcon,
  XIcon,
  TrashIcon,
  UserRemoveIcon,
  UserAddIcon,
} from "@heroicons/react/outline";

import { createComment } from "../../utils/api/comments";

import { fetchComments } from "../../redux/tweet-details/tweet-details.actions";
import Loader from "../../components/Loader";
import {
  followUser,
  getFollowingIds,
  getProfileFollowing,
  getUserDetails,
  unfollowUser,
} from "../../utils/api/users";
import {
  addBookmarkById,
  deleteBookmarkById,
  getBookmarkIds,
  getBookmarks,
  pinPost,
  unpinPost,
} from "../../utils/api/posts";
import PinListItem from "../../components/ListItems/PinListItem";
import CommentModal from "../../components/CommentModal";
import { handleReplyToUsernames } from "../../utils/handlers";
import ArrowButton from "../../components/Buttons/ArrowButton";
import DefaultAvatar from "../../components/DefaultAvatar";
import MoreButton from "../../components/Buttons/MoreButton";
import LastSeen from "../../components/LastSeen";
import BookmarkButton from "../../components/Buttons/BookmarkButton";
import useAutosizeTextArea from "../../hooks/useAuthsizeTextArea";
import isAuthFollowingPostDetailsUser from "./helpers/authFollowingChecker";
import { pinTweet, unpinTweet } from "../../redux/users/users.actions";
import { getPostDetailsLikes } from "./helpers/getPostLikes";

// TODOs:
// Reply to users - above tweet details
// Create comment modal
// Add tweet details/comment to bookmarks
// Pin tweet details/comment to your profile
// Load the getThreadPosts return posts after the TWEET_DETAILS_SUCCESS

const TweetDetails = () => {
  // const user = useSelector((state) => state.users.user);
  const { user, authsPinnedPost } = useSelector((state) => state.users);
  const { post, loading, comments, commentsLoading, repliedToPosts, error } =
    useSelector((state) => state.tweetDetails);
  const ref = useRef("");
  const [layoutLoading, setLayoutLoading] = useState(true);

  const [height, setHeight] = useState(0);
  const textAreaRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [bookmarks, setBookmarks] = useState([]);
  const [modal, setModal] = useState(false);
  const [input, setInput] = useState("");
  const [isLiked, setIsLiked] = useState(null);
  const [commentDisplay, setCommentDisplay] = useState({});
  const [commentDropdown, setCommentDropdown] = useState(false);
  const [commentDropdownHeight, setCommentDropdownHeight] = useState();
  const [textAreaRows, setTextAreaRows] = useState(1);
  const [authsFollowing, setAuthsFollowing] = useState([]);
  const [followingPostDetailsUser, setFollowingPostDetailsUser] =
    useState(false);
  const [postLikes, setPostLikes] = useState([]);

  const [commentModal, setCommentModal] = useState(false);
  const [moreModal, setMoreModal] = useState(false);

  useAutosizeTextArea(textAreaRef.current, input);

  const openLikesModal = () => {
    setModal(true);
  };
  const closeLikesModal = () => setModal(false);

  const handleOpenCommentModal = (post) => {
    setCommentModal(true);
    setCommentDisplay(post);
  };

  const handleCloseCommentModal = () => {
    setCommentModal(false);
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const createPost = async (e, input, replyToPost, media, target) => {
    e.preventDefault();

    if (target === "comment_section") {
      await createComment(
        input,
        replyToPost,
        media,
        user,
        replyToPost.postType
      );
      dispatch(fetchComments(post.id));

      setInput("");
    }

    if (target === "modal") {
      await createComment(
        input,
        commentDisplay,
        media,
        user,
        commentDisplay.postType
      );
      dispatch(fetchComments(post.id));

      setCommentModal(false);
    }

    if (target === "replyTo_section") {
    }
  };

  const handleLikeRepliedToPost = (postId) =>
    dispatch(likeRepliedToPost(postId));

  const handleLikePostDetails = async () => {
    const likes = await dispatch(likePostDetails(post.id));

    if (isLiked) {
      setPostLikes(postLikes.filter((u) => u.id !== user.id));
    } else {
      setPostLikes([user, ...postLikes]);
    }

    handleIsLiked(likes);
  };

  const handleLikeComment = async (postId) => {
    dispatch(likeComment(postId));
  };

  const handleIsLiked = (likes) => {
    const liked = likes?.find((like) => like === user.id);
    if (liked) setIsLiked(true);
    else setIsLiked(false);
  };

  const getAuthsFollowing = async () => {
    const userIds = await getFollowingIds(user.id);
    setAuthsFollowing(userIds);
    return userIds;
  };

  const followPostDetailsUser = async () => {
    const match = authsFollowing.find((userId) => userId === post.uid);
    if (match) {
      await unfollowUser(post.uid, user.id);
      setAuthsFollowing(authsFollowing.filter((userId) => userId !== post.uid));
      setFollowingPostDetailsUser(false);
    } else {
      await followUser(post.uid, user.id);
      setAuthsFollowing([...authsFollowing, post.uid]);
      setFollowingPostDetailsUser(true);
    }
  };

  const handleUserDetails = () => {
    navigate(`/${post.username}`);
  };

  useLayoutEffect(() => {
    setHeight(ref.current.offsetHeight);
  }, [params.tweetId]);

  useEffect(() => {
    const asyncFunc = async () => {
      dispatch(fetchComments(params.tweetId));
      const postDetails = await dispatch(getPostDetails(params.tweetId));

      const likes = await getPostDetailsLikes(postDetails.likes);
      setPostLikes(likes);

      const bookmarkIds = await getBookmarkIds(user.id);
      setBookmarks(bookmarkIds);

      handleIsLiked(postDetails.likes);
    };

    console.log("Post Likes: ", postLikes);

    // setHeight(ref.current.offsetHeight);
    asyncFunc();
  }, [params.tweetId]);

  useEffect(() => {
    window.addEventListener("resize", setHeight(ref.current.offsetHeight));
    setLayoutLoading(false);
  }, []);
  console.log("Rows:", input.length + (input.match(/\n/g) || []).length);

  const handleDeletePost = (postId) => {
    if (postId === post.id) {
    }
    dispatch(deletePost(postId, user.id));
    setMoreModal(false);
  };

  const handleAddBookmark = async (postId) => {
    setBookmarks([...bookmarks, postId]);
    await addBookmarkById(postId, user.id);
  };

  const handleRemoveBookmark = async (postId) => {
    setBookmarks(bookmarks.filter((bookmarkId) => bookmarkId !== postId));
    await deleteBookmarkById(postId, user.id);
  };

  const handlePinPost = async (post) => dispatch(pinTweet(post, user.id));
  const handleUnpinPost = async (post) => dispatch(unpinTweet(post, user.id));

  const handleFollowUser = async (post) => {
    dispatch(toggleFollowPostUser(post, user.id));
    const updatedLikes = postLikes.map((u) => {
      if (u.id === post.uid) {
        const match = post.followers.find(
          (follower) => follower.id === user.id
        );

        if (match) {
          u.followers = u.followers.filter(
            (follower) => follower.id !== user.id
          );
        } else {
          u.followers = [...u.followers, user];
        }
      }

      return u;
    });
    setPostLikes(updatedLikes);
    setMoreModal(false);
  };

  const handleFollowLikedUser = async (userToFollow) => {
    const match = userToFollow.followers.find(
      (follower) => follower.id === user.id
    );
    if (match) {
      const updatedLikes = postLikes.map((u) => {
        if (u.id === userToFollow.id) {
          u.followers = u.followers.filter(
            (follower) => follower.id !== user.id
          );
        }

        return u;
      });
      setPostLikes(updatedLikes);

      await unfollowUser(userToFollow.id, user.id);
    } else {
      const updatedLikes = postLikes.map((u) => {
        if (u.id === userToFollow.id) {
          u.followers = [...u.followers, user];
        }

        return u;
      });
      setPostLikes(updatedLikes);

      await followUser(userToFollow.id, user.id);
    }
  };

  const authUserIsFollowingPostUser = post?.followers?.find(
    (follower) => follower.id === user.id
  );

  console.log("Post Likes: ", postLikes);

  return (
    <>
      {loading ? (
        <div className="mt-10">
          <Loader />
        </div>
      ) : (
        <div>
          {layoutLoading ? (
            <Loader />
          ) : (
            <div className={`relative bottom-[${height}px]`}>
              <Modal
                modal={modal}
                closeModal={closeLikesModal}
                component="Edit Profile"
              >
                {postLikes.map((like) => (
                  <div className="hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 py-2 px-4 z-100">
                    <div className="flex">
                      {like.avatar === null || like.avatar === "" ? (
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white">
                          <DefaultAvatar
                            name={like.name}
                            username={like.username}
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 flex items-center justify-center  rounded-full bg-white">
                          <img
                            onClick={handleUserDetails}
                            className="h-12 w-12 rounded-full object-cover"
                            src={like.avatar}
                            alt=""
                          />
                        </div>
                      )}
                      <div className="items-center mb-2 w-full">
                        <div className="flex justify-between items-center">
                          <div
                            onClick={() => navigate(`/${like.username}`)}
                            className="w-full"
                          >
                            <div className="font-bold">{like.name}</div>
                            <div className="text-gray-500 mb-1">
                              @{like.username}
                            </div>
                          </div>
                          <>
                            {user.id === like.id ? (
                              ""
                            ) : (
                              <div className="">
                                {like.followers.find(
                                  (follower) => follower.id === user.id
                                ) ? (
                                  <div
                                    className="bg-black flex items-center justify-center h-8 text-white text-sm font-bold rounded-full px-4"
                                    onClick={() => handleFollowLikedUser(like)}
                                  >
                                    Unfollow
                                  </div>
                                ) : (
                                  <div
                                    className="bg-black flex items-center justify-center h-8 text-white text-sm font-bold rounded-full px-4"
                                    onClick={() => handleFollowLikedUser(like)}
                                  >
                                    Follow
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        </div>
                        <div onClick={() => navigate(`/${like.username}`)}>
                          {user.id === like.uid ? "" : like.bio}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Modal>
              <div className="z-30 sticky top-0 bg-white px-3 py-2 flex items-center">
                <div className="mr-6">
                  <ArrowButton />
                </div>
                <div className="text-xl font-bold">Thread</div>
              </div>

              <div ref={ref} className="">
                {repliedToPosts?.map((post) => (
                  <div className="relative">
                    {post.replyToPostDeleted && (
                      <div className="w-1/2 z-100 text-sm my-3 bg-gray-50 border text-gray-500 py-2 px-5 font-semibold ml-4 rounded-md">
                        Tweet deleted by Author
                      </div>
                    )}

                    <Tweet
                      key={post.id}
                      id={post.id}
                      post={post}
                      handleLikePost={handleLikeRepliedToPost}
                      handleDeletePost={handleDeletePost}
                      handlePinPost={handlePinPost}
                      handleUnpinPost={handleUnpinPost}
                      handleFollowUser={handleFollowUser}
                      handleOpenCommentModal={handleOpenCommentModal}
                      userDeletedPost={true}
                      threadPost={true}
                      bookmarks={bookmarks}
                      handleRemoveBookmark={handleRemoveBookmark}
                      handleAddBookmark={handleAddBookmark}
                      setBookmarks={setBookmarks}
                    />
                  </div>
                ))}
              </div>
              <div className="relative">
                {post?.replyToPostDeleted && (
                  <div className="w-1/2  text-sm my-3 bg-gray-50 border text-gray-500 py-2 px-5 font-semibold ml-4 rounded-md">
                    Tweet deleted by Author
                  </div>
                )}
              </div>
              {post?.deleted || post === null ? (
                <div className="absolute left-0 right-0 flex justify-center bg-gray-100 pb-8 mt-4">
                  <div className="w-1/2">
                    <img src={cageImage} alt="" />
                    <div className="text-2xl font-bold">
                      Tweet deleted by Author
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-1">
                  <div className="relative flex justify-between pl-3 pt-2">
                    <div className="flex items-center">
                      {post.avatar === null ? (
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white">
                          <DefaultAvatar
                            name={post.name}
                            username={post.username}
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 flex items-center justify-center  rounded-full bg-white">
                          <img
                            onClick={handleUserDetails}
                            className="h-12 w-12 rounded-full object-cover"
                            src={post.avatar}
                            alt=""
                          />
                        </div>
                      )}

                      <div className="ml-3">
                        <div className="font-bold">{post.name}</div>
                        <div className="text-gray-500 text-sm">
                          @{post.username}
                        </div>
                      </div>
                    </div>
                    {!commentsLoading && (
                      <MoreButton openModal={() => setMoreModal(true)} />
                    )}

                    {moreModal ? (
                      <div
                        onClick={() => setMoreModal(false)}
                        className="bg-transparent cursor-default fixed top-0 bottom-0 left-0 right-0 opacity-40 w-screen h-screen z-50"
                      ></div>
                    ) : null}

                    {moreModal ? (
                      <div className="rounded-md w-1/2 absolute top-10 right-10 z-50 shadow-lg bg-white border-t">
                        {post.uid === user.id ? (
                          <>
                            <div
                              onClick={() => handleDeletePost(post.id)}
                              className="flex items-center p-4 text-red-500 cursor-pointer hover:bg-gray-100"
                            >
                              <TrashIcon className="h-5 w-5 mr-3" />{" "}
                              <div>Delete</div>
                            </div>

                            <PinListItem
                              post={post}
                              closeModal={() => setMoreModal(false)}
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            {authUserIsFollowingPostUser ? (
                              <div
                                onClick={() => handleFollowUser(post)}
                                className=" flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                              >
                                <UserRemoveIcon className="h-5 w-5 mr-3" />{" "}
                                Unfollow @{post.username}
                              </div>
                            ) : (
                              <div
                                onClick={() => handleFollowUser(post)}
                                className=" flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                              >
                                <UserAddIcon className="h-5 w-5 mr-3" /> Follow
                                @{post.username}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={`flex space-x-1 ${
                      post.postType === "comment" && "mt-4"
                    }`}
                  >
                    <div className="text-gray-500 ml-4">
                      {post.postType === "tweet" ? null : (
                        <div>Replying to</div>
                      )}{" "}
                    </div>
                    {repliedToPosts.length === 0 &&
                    post.postType === "comment" ? (
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
                    <div className="flex items-center mb-4">
                      {" "}
                      {handleReplyToUsernames(repliedToPosts, post).map(
                        (username) => (
                          <div className="tweet__userWhoReplied flex items-center text-blue-500">
                            <div
                              onClick={() => navigate(`/${username}`)}
                              className="mr-1  cursor-pointer hover:underline"
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
                  <div className="text-2xl px-4 pb-3">{post.message}</div>
                  <div className="px-4 pb-3">
                    {post.media ? (
                      <img
                        className="w-full h-100 rounded-xl"
                        src={post.media}
                        alt="Media Content"
                      />
                    ) : null}
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${
                      post.comments?.length === 0 && post.likes.length === 0
                        ? "border-none"
                        : "border-b"
                    } px-4 pb-4`}
                  >
                    <div className="text-gray-500">
                      <Moment unix format="hh:mm A">
                        {post.timestamp.seconds}
                      </Moment>
                    </div>
                    <div className="h-0.5 w-0.5 rounded-full bg-gray-500 mr-1.5"></div>

                    <div className="text-gray-500">
                      <Moment unix format="MMM D, YYYY">
                        {post.timestamp.seconds}
                      </Moment>
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-4 px-4 py-4 border-b`}
                  >
                    <div className="flex items-center">
                      <div className="mr-1 font-semibold">
                        {" "}
                        {post.comments?.length === 0
                          ? ""
                          : post.comments?.length}
                      </div>

                      <div className="text-gray-500">
                        {post.comments?.length === 0
                          ? ""
                          : post.comments?.length === 1
                          ? "Reply"
                          : "Replies"}
                      </div>
                    </div>
                    <div
                      onClick={openLikesModal}
                      className="flex items-center hover:underline cursor-pointer"
                    >
                      <div className="mr-1 font-semibold">
                        {post.likes?.length === 0 ? "" : post.likes?.length}
                      </div>
                      <div className="text-gray-500">
                        {post.likes?.length === 0 ? "" : "Likes"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-evenly border-b px-4 py-4">
                    <Tooltip
                      className="p-1 rounded-sm text-xs bg-gray-500"
                      placement="bottom"
                      content="Reply"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 1 },
                      }}
                    >
                      <div
                        onClick={() => handleOpenCommentModal(post)}
                        className="flex cursor-pointer items-center space-x-3 text-gray-400"
                      >
                        <ChatAlt2Icon className="h-7 w-7" />
                      </div>
                    </Tooltip>
                    <Tooltip
                      className="p-1 rounded-sm text-xs bg-gray-500"
                      placement="bottom"
                      content="Retweet feature coming soon"
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 1 },
                      }}
                    >
                      <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
                        <SwitchHorizontalIcon className={`h-7 w-7 `} />
                      </div>
                    </Tooltip>
                    <Tooltip
                      className="p-1 rounded-sm text-xs bg-gray-500"
                      placement="bottom"
                      content={isLiked ? "Unlike" : "Like"}
                      animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 1 },
                      }}
                    >
                      <div
                        onClick={handleLikePostDetails}
                        className={`flex cursor-pointer items-center space-x-3 text-${
                          isLiked ? "red" : "gray"
                        }-400`}
                      >
                        <HeartIcon
                          fill={isLiked ? "red" : "transparent"}
                          className="h-7 w-7"
                        />
                      </div>
                    </Tooltip>
                    {/* <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
                      <UploadIcon
                        onClick={() => createBookmark(post.id)}
                        className="h-7 w-7"
                      />
                    </div> */}

                    <BookmarkButton
                      handleAddBookmark={() => handleAddBookmark(post.id)}
                      handleRemoveBookmark={() => handleRemoveBookmark(post.id)}
                      bookmarks={bookmarks}
                      post={post}
                      enlarged={true}
                    />
                  </div>
                  <>
                    <div
                      className={`relative flex ${
                        !commentDropdown && "items-center"
                      }  border-b px-2 py-4`}
                    >
                      <div className="relative mr-2">
                        {user.avatar === null || user.avatar === "" ? (
                          <div className="absolute top-0 h-full">
                            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-40">
                              <div className="h-12 w-12 rounded-full flex justify-center items-center">
                                <DefaultAvatar
                                  name={user.name}
                                  username={user.username}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="">
                            <div
                              className={`h-16 w-16 bg-white flex ${
                                commentDropdown ? "items-start" : "items-center"
                              }  justify-center z-40`}
                            >
                              <div className="h-12 w-12 rounded-full flex justify-center items-center">
                                <img
                                  onClick={handleUserDetails}
                                  src={user.avatar}
                                  alt="Profile Image"
                                  className={`object-cover h-12 w-12 rounded-full`}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="w-full relative">
                        <div className="w-full flex items-center">
                          <textarea
                            rows={1}
                            value={input}
                            onChange={handleInputChange}
                            onClick={() => setCommentDropdown(true)}
                            type="text"
                            ref={textAreaRef}
                            placeholder="Tweet your reply"
                            className="text-gray-400 text-xl outline-none w-full resize-none"
                          />
                          {!commentDropdown && (
                            <button
                              onClick={(e) =>
                                createPost(e, post, "comment_section")
                              }
                              disabled={input === "" ? true : false}
                              className={`bg-blue-400 ${
                                input === "" && "opacity-70"
                              } text-white py-2 px-5 rounded-full font-bold`}
                            >
                              Reply
                            </button>
                          )}
                        </div>

                        {commentDropdown && (
                          <div
                            className={`flex justify-between items-center text-blue-400 mt-6 `}
                          >
                            <div className="relative flex items-center cursor-pointer transition-transform duration-150 ease-out hover:scale-125">
                              <PhotographIcon className="h-5 w-5 z-50 hover:cursor-pointer transition-transform duration-150 ease-out hover:scale-150" />
                              <input
                                onClick={(e) => {
                                  return (e.target.value = null);
                                }}
                                // onChange={handleFileChange}
                                className="w-5 h-5 z-10 opacity-0 absolute top-0 flex-wrap"
                                name="file"
                                type="file"
                              />
                            </div>
                            <button
                              onClick={(e) =>
                                createPost(e, post, "comment_section")
                              }
                              disabled={input.length === 0 ? true : false}
                              className={`bg-blue-400 ${
                                input.length === 0 && "opacity-70"
                              } text-white py-2 px-5 h-10 flex rounded-full justify-center items-center font-bold`}
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="">
                      {post === null &&
                      post?.deleted &&
                      comments?.length === 0 ? null : (
                        <Comments
                          handleLikePost={handleLikeComment}
                          handleDeletePost={handleDeletePost}
                          handlePinPost={handlePinPost}
                          handleUnpinPost={handleUnpinPost}
                          handleAddBookmark={handleAddBookmark}
                          handleRemoveBookmark={handleRemoveBookmark}
                          handleFollowUser={handleFollowUser}
                          handleOpenCommentModal={handleOpenCommentModal}
                          tabs={null}
                          // fetchComments={() => dispatch(fetchComments(params?.tweetId))}
                          comments={comments}
                          commentsLoading={commentsLoading}
                          bookmarks={bookmarks}
                          postDetailsDeleted={
                            post?.deleted || post === null ? true : false
                          }
                        />
                      )}
                    </div>
                  </>
                </div>
              )}
            </div>
          )}
          {commentModal ? (
            <CommentModal
              post={commentDisplay}
              handleCreateComment={createPost}
              redux={true}
              // input={commentModalInput}
              // handleInputChange={(e) => setCommentModalInput(e.target.value)}
              handleCloseCommentModal={handleCloseCommentModal}
              // refresh={handleFetchComments}
            />
          ) : null}
        </div>
      )}
    </>
  );
};

export default TweetDetails;
