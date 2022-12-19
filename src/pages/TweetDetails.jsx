import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import cageImage from "../images/cage.png";

import Modal from "../components/Modal";
import Comments from "../components/Comments";
import Tweet from "../components/Tweet/Tweet2";

import {
  deletePost,
  getPostDetails,
  getThreadPosts,
  likeComment,
  likePostDetails,
  likeRepliedToPost,
  refreshPost,
  toggleFollowPostUser,
} from "../redux/tweet-details/tweet-details.actions";

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

import { createComment } from "../utils/api/comments";

import { fetchComments } from "../redux/tweet-details/tweet-details.actions";
import Loader from "../components/Loader";
import { getUserDetails } from "../utils/api/users";
import {
  addBookmarkById,
  getBookmarkIds,
  getBookmarks,
  pinPost,
  unpinPost,
} from "../utils/api/posts";
import PinListItem from "../components/ListItems/PinListItem";
import CommentModal from "../components/CommentModal";
import { handleReplyToUsernames } from "../utils/handlers";
import ArrowButton from "../components/Buttons/ArrowButton";
import DefaultAvatar from "../components/DefaultAvatar";
import MoreButton from "../components/Buttons/MoreButton";

// TODOs:
// Reply to users - above tweet details
// Create comment modal
// Add tweet details/comment to bookmarks
// Pin tweet details/comment to your profile
// Load the getThreadPosts return posts after the TWEET_DETAILS_SUCCESS

const TweetDetails = () => {
  const user = useSelector((state) => state.users.user);
  const { post, loading, comments, commentsLoading, repliedToPosts, error } =
    useSelector((state) => state.tweetDetails);
  const ref = useRef("");
  const [layoutLoading, setLayoutLoading] = useState(true);

  const [height, setHeight] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [bookmarks, setBookmarks] = useState([]);
  const [modal, setModal] = useState(false);
  const [input, setInput] = useState("");
  const [commentModalInput, setCommentModalInput] = useState("");
  const [isLiked, setIsLiked] = useState(null);
  const [pinnedPost, setPinnedPost] = useState({});
  const [commentDisplay, setCommentDisplay] = useState({});

  const [commentModal, setCommentModal] = useState(false);
  const [moreModal, setMoreModal] = useState(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleOpenCommentModal = (post) => {
    setCommentModal(true);
    setCommentDisplay(post);
  };

  const handleCloseCommentModal = () => {
    setCommentModal(false);
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const createPost = async (e, replyToPost, target) => {
    e.preventDefault();

    if (target === "comment_section") {
      await createComment(input, replyToPost, null, user, replyToPost.postType);
      dispatch(fetchComments(post.id));

      setInput("");
    }

    if (target === "modal") {
      await createComment(
        commentModalInput,
        commentDisplay,
        null,
        user,
        commentDisplay.postType
      );
      dispatch(fetchComments(post.id));

      setCommentModal(false);
      setCommentModalInput("");
    }

    if (target === "replyTo_section") {
    }
  };

  const handleLikeRepliedToPost = (postId) =>
    dispatch(likeRepliedToPost(postId));

  const handleLikePostDetails = async () => {
    const likes = await dispatch(likePostDetails(post.id));
    handleIsLiked(likes);
  };

  const getAuthBookmarks = async () => {
    const bookmarkIds = await getBookmarkIds(user.id);
    console.log("Bookmark Ids: ", bookmarkIds);
    setBookmarks(bookmarkIds);
  };


  const handleLikeComment = async (postId) => {
    dispatch(likeComment(postId));
  };

  const handleIsLiked = (likes) => {
    const liked = likes?.find((like) => like.id === user.id);
    if (liked) setIsLiked(true);
    else setIsLiked(false);
  };

  const handleUserDetails = () => {
    navigate(`/${post.username}`);
  };

  useLayoutEffect(() => {
    setHeight(ref.current.offsetHeight);
  }, [params.tweetId]);

  useEffect(() => {
    getAuthBookmarks();
    const fetchTweetDetails = async () => {
      const postDetails = await dispatch(getPostDetails(params.tweetId));
      dispatch(fetchComments(postDetails.id));

      handleIsLiked(postDetails.likes);
    };

    // setHeight(ref.current.offsetHeight);

    fetchTweetDetails();
  }, [params.tweetId]);

  useEffect(() => {
    window.addEventListener("resize", setHeight(ref.current.offsetHeight));
    setLayoutLoading(false);
  }, []);

  // useLayoutEffect(() => {

  // }, [params.tweetId]);

  // useEffect(() => {
  //   const fetchTweetDetails = async () => {
  //     const postDetails = await dispatch(getPostDetails(params.tweetId));
  //     handleIsLiked(postDetails.likes);
  //   };

  //   fetchTweetDetails();
  // }, [params.tweetId]);

  const handleDeletePost = (postId) => dispatch(deletePost(postId, user.id));
  const handleRefreshPost = (postId) => dispatch(refreshPost(postId));

  const createBookmark = async (postId) => {
    const bookmarks = await getBookmarks(user.id);

    const alreadyBookmarked = bookmarks.find((post) => post.id === postId);

    if (alreadyBookmarked) {
    } else {
      await addBookmarkById(postId, user.id);
    }
  };

  const handlePinPost = async (postId) => {
    const post = await pinPost(postId, user.id);

    if (post.uid === user.id) {
      const authUser = await getUserDetails(user.username);

      setPinnedPost(authUser.pinnedPost);
    }
  };
  const handleUnpinPost = async (postId) => {
    const post = await unpinPost(postId, user.id);

    if (post.uid === user.id) {
      const authUser = await getUserDetails(user.username);

      setPinnedPost(authUser.pinnedPost);
    }
  };

  const handleFollowUser = async (post) => {
    dispatch(toggleFollowPostUser(post, user.id));
  };

  const handleFetchComments = () => dispatch(fetchComments(post.id))

  // const getAuthBookmarks = async () => {
  //   const bookmarks = await getBookmarks(user.id);
  //   setBookmarks(bookmarks);
  // };

  const authUserIsFollowingPostUser = post?.followers?.find(
    (follower) => follower.id === user.id
  );

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
                closeModal={closeModal}
                component="Edit Profile"
              >
                {post?.likes?.map((like) => (
                  <div className="hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 p-4">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full object-cover mr-3"
                        src="https://picsum.photos/200"
                        alt=""
                      />
                      <div className="flex justify-between mb-2 w-full">
                        <div>
                          <div className="font-bold">{like.name}</div>
                          <div className="text-gray-500 mb-1">
                            @{like.username}
                          </div>
                          <div>{user.id === like.uid ? "" : like.bio}</div>
                        </div>
                        {user.id === like.uid ? (
                          ""
                        ) : (
                          <button className="bg-black h-8 text-white font-bold rounded-full px-4">
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Modal>
              <div className="z-50 sticky top-0 bg-white px-3 py-2 flex items-center">
                <div className="mr-6">
                  <ArrowButton />
                </div>
                <div className="text-xl font-bold">Thread</div>
              </div>

              <div ref={ref} className="">
                {repliedToPosts?.map((post) => (
                  <div className="">
                    {post.replyToPostDeleted && (
                      <div className="w-1/2 z-50 my-3 text-sm bg-gray-200 text-gray-500 py-2 px-5 font-semibold ml-4 rounded-md">
                        Tweet deleted by Author
                      </div>
                    )}

                    <Tweet
                      key={post.id}
                      id={post.id}
                      post={post}
                      isPinned={
                        pinnedPost?.id && pinnedPost?.id === post.id
                          ? true
                          : false
                      }
                      handleLikePost={handleLikeRepliedToPost}
                      handleDeletePost={handleDeletePost}
                      handleRefreshPost={handleRefreshPost}
                      // handleRefreshPosts={handleRefreshPosts}
                      handlePinPost={handlePinPost}
                      handleUnpinPost={handleUnpinPost}
                      handleFollowUser={handleFollowUser}
                      handleAddBookmark={createBookmark}
                      handleOpenCommentModal={handleOpenCommentModal}
                      userDeletedPost={true}
                      threadPost={true}
                      bookmarks={bookmarks}
                      setBookmarks={setBookmarks}
                    />
                  </div>
                ))}
              </div>
              <div>
                {post?.replyToPostDeleted && (
                  <div className="w-1/2 z-50 text-sm my-3 bg-gray-200 text-gray-500  py-2 px-5 font-semibold ml-4 rounded-md">
                    Tweet deleted by Author
                  </div>
                )}
              </div>
              {post.deleted || post === null ? (
                <div className="absolute left-0 right-0 flex justify-center bg-white  z-50">
                  <div className="w-1/2">
                    <img src={cageImage} alt="" />
                    <div className="text-2xl font-bold">
                      Tweet deleted by Author
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pr-4 ">
                  <div className="relative flex justify-between pl-2 pt-2">
                    <div className="flex items-center">
                      {post.avatar === null ? (
                        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white z-50">
                          <DefaultAvatar
                            name={post.name}
                            username={post.username}
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 flex items-center justify-center  rounded-full bg-white z-50">
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

                    <MoreButton openModal={() => setMoreModal(true)} />

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

                            <PinListItem post={post} />
                          </>
                        ) : (
                          <>
                            {" "}
                            {authUserIsFollowingPostUser ? (
                              <div
                                onClick={() => handleFollowUser(post)}
                                className=" flex items-center p-4 hover:bg-gray-100"
                              >
                                <UserRemoveIcon className="h-5 w-5 mr-3" />{" "}
                                Unfollow @{post.username}
                              </div>
                            ) : (
                              <div
                                onClick={() => handleFollowUser(post)}
                                className=" flex items-center p-4 hover:bg-gray-100"
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
                    {repliedToPosts.length === 0 && post.postType === "comment" ? (
                  <div className="text-blue-500">
                    @User
                  </div>
                ) : null}
                    <div className="flex items-center mb-4">
                      {" "}
                      {handleReplyToUsernames(repliedToPosts, post).map(
                        (username) => (
                          <div className="tweet__userWhoReplied flex items-center text-blue-500">
                            <div
                              onClick={() => handleUserDetails(username)}
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
                  <div className="flex items-center space-x-2 border-b px-4 pb-4">
                    <div>Time</div>
                    <div>🔵 </div>
                    <div>Date</div>
                  </div>

                  <div className="flex items-center space-x-4 px-4 py-4 border-b">
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
                      onClick={openModal}
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
                    <div
                      onClick={() => handleOpenCommentModal(post)}
                      className="flex cursor-pointer items-center space-x-3 text-gray-400"
                    >
                      <ChatAlt2Icon className="h-7 w-7" />
                    </div>
                    <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
                      <SwitchHorizontalIcon className={`h-7 w-7 `} />
                    </div>
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
                    <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
                      <UploadIcon
                        onClick={() => createBookmark(post.id)}
                        className="h-7 w-7"
                      />
                    </div>
                  </div>
                  <div className="flex items-center border-b  px-4 py-4">
                    <img
                      className="h-12 w-12 rounded-full object-cover mr-5"
                      src="https://picsum.photos/200"
                      alt=""
                    />
                    <form
                      onSubmit={(e) => createPost(e, post, "comment_section")}
                      className="w-full flex items-center"
                      action=""
                    >
                      <input
                        value={input}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Tweet your reply"
                        className="text-gray-400 text-xl outline-none w-full"
                      />
                      <button
                        onClick={(e) => createPost(e, post, "comment_section")}
                        disabled={input === "" ? true : false}
                        className={`bg-blue-400 ${
                          input === "" && "opacity-70"
                        } text-white py-2 px-5 rounded-full font-bold`}
                      >
                        Reply
                      </button>
                    </form>
                  </div>
                </div>
              )}
              <div>
                <Comments
                  handleLikePost={handleLikeComment}
                  handleDeletePost={handleDeletePost}
                  handlePinPost={handlePinPost}
                  handleUnpinPost={handleUnpinPost}
                  handleFollowUser={handleFollowUser}
                  handleOpenCommentModal={handleOpenCommentModal}
                  tabs={null}
                  fetchComments={() => dispatch(fetchComments(params?.tweetId))}
                  comments={comments}
                  commentsLoading={commentsLoading}
                  bookmarks={bookmarks}
                />
              </div>
            </div>
          )}
          {commentModal ? (
            <CommentModal
              post={commentDisplay}
              createPost={createPost}
              input={commentModalInput}
              handleInputChange={(e) => setCommentModalInput(e.target.value)}
              handleCloseCommentModal={handleCloseCommentModal}
              refresh={handleFetchComments}
            />
          ) : null}
        </div>
      )}
    </>
  );
};

export default TweetDetails;
