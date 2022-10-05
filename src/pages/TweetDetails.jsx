import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

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
} from "@heroicons/react/outline";

import { createComment } from "../utils/api/comments";

import { fetchComments } from "../redux/tweet-details/tweet-details.actions";
import Loader from "../components/Loader";
import { getUserDetails } from "../utils/api/users";
import {
  addBookmark,
  getBookmarks,
  getReplyToPosts,
  pinPost,
  unpinPost,
} from "../utils/api/posts";
import PinListItem from "../components/ListItems/PinListItem";

// TODOs:
// Reply to users - above tweet details
// Create comment modal
// Add tweet details/comment to bookmarks
// Pin tweet details/comment to your profile
// Load the getThreadPosts return posts after the TWEET_DETAILS_SUCCESS

const TweetDetails = () => {
  const user = useSelector((state) => state.users.user);
  const { post, loading, repliedToPosts } = useSelector(
    (state) => state.tweetDetails
  );
  const ref = useRef("");
  const [layoutLoading, setLayoutLoading] = useState(true);

  const [height, setHeight] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [modal, setModal] = useState(false);
  const [input, setInput] = useState("");
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

  const handleCloseCommentModal = (post) => {
    setCommentModal(false);
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleCreateTweet = async (e) => {
    e.preventDefault();

    await createComment(input, post, user, post.postType);
    dispatch(fetchComments(post.id, post.postType));

    setInput("");
  };

  const handleLikeRepliedToPost = (postId) =>
    dispatch(likeRepliedToPost(postId));

  const handleLikePostDetails = async () => {
    const likes = await dispatch(likePostDetails(post.id));
    handleIsLiked(likes);
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
    const fetchTweetDetails = async () => {
      const postDetails = await dispatch(getPostDetails(params.tweetId));

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

  console.log("Height: ", height);

  const handleDeletePost = (postId) => dispatch(deletePost(postId, user.id));
  const handleRefreshPost = (postId) => dispatch(refreshPost(postId));

  const createBookmark = async (postId) => {
    const bookmarks = await getBookmarks(user.id);

    const alreadyBookmarked = bookmarks.find((post) => post.id === postId);

    if (alreadyBookmarked) {
    } else {
      await addBookmark(postId, user.id);
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

  function removeDuplicateUsernames() {
    const usernames = repliedToPosts?.map((user) => user.username);
    return [...new Set(usernames)].reverse();
  }

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
              <Modal modal={modal} closeModal={closeModal}>
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

              <div ref={ref} className="">
                {repliedToPosts?.map((post) => (
                  <div className="">
                    {post.replyToPostDeleted && (
                      <div className="w-1/2 my-3 bg-gray-200 text-gray-500 p-2 font-semibold ml-4 rounded-md">
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
                    />
                  </div>
                ))}
              </div>
              <div>
                {post.replyToPostDeleted && (
                  <div className="w-1/2 my-3 bg-gray-200 text-gray-500 p-2 font-semibold ml-4 rounded-md">
                    Tweet deleted by Author
                  </div>
                )}
              </div>
              <div className="">
                <div className="relative flex justify-between px-4 py-3">
                  <div className="flex">
                    <img
                      onClick={handleUserDetails}
                      className="h-12 w-12 rounded-full object-cover mr-3"
                      src="https://picsum.photos/200"
                      alt=""
                    />
                    <div>
                      <div className="font-bold">{post.name}</div>
                      <div className="text-gray-500 text-sm">
                        @{post.username}
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setMoreModal(true)}
                    className="w-9 h-9 flex group items-center justify-center absolute right-5 rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
                  >
                    <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
                  </div>
                  {moreModal ? (
                    <div className="rounded-md w-1/2 absolute top-10 right-10 z-50 shadow-lg bg-white border-t">
                      <div className="py-2 pr-1 flex justify-end">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                          <XIcon
                            onClick={() => setMoreModal(false)}
                            className="h-5 w-5 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex items-center p-3 text-red-500 cursor-pointer hover:bg-gray-100">
                        <TrashIcon className="h-5 w-5 mr-3" /> <div>Delete</div>
                      </div>
                      <PinListItem post={post} />
                    </div>
                  ) : null}
                </div>

                <div className="flex space-x-1">
                  <div className="text-gray-500 ml-4 mb-4">Replying to </div>
                  <div className="flex items-center mb-4">
                    {" "}
                    {removeDuplicateUsernames().map((username) => (
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
                    ))}
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
                    <div className="mr-1 font-semibold">29</div>
                    <div className="text-gray-500">Retweets</div>
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
                  <div className="flex cursor-pointer items-center space-x-3 text-gray-400">
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
                    onSubmit={handleCreateTweet}
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
                      onClick={handleCreateTweet}
                      disabled={input === "" ? true : false}
                      className={`bg-blue-400 ${
                        input === "" && "opacity-70"
                      } text-white py-2 px-5 rounded-full font-bold`}
                    >
                      Reply
                    </button>
                  </form>
                </div>

                <div>
                  <Comments
                    handleLikePost={handleLikeComment}
                    handleDeletePost={handleDeletePost}
                    handlePinPost={handlePinPost}
                    handleUnpinPost={handleUnpinPost}
                    handleFollowUser={handleFollowUser}
                    handleOpenCommentModal={handleOpenCommentModal}
                    tabs={null}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TweetDetails;
