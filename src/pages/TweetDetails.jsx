import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Modal from "../components/Modal";
import Comments from "../components/Comments";
import Tweet from "../components/Tweet";

import {
  getPostDetails,
  likePostDetails,
  likeRepliedToPost,
} from "../redux/tweet-details/tweet-details.actions";

import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from "@heroicons/react/outline";

import { createComment } from "../utils/api/comments";

import { fetchComments } from "../redux/tweet-details/tweet-details.actions";
import Loader from "../components/Loader";

// TODOs: 
// Reply to users - above tweet details
// Create comment modal
// Add tweet details/comment to bookmarks
// Pin tweet details/comment to your profile

const TweetDetails = () => {
  const user = useSelector((state) => state.users.user);
  const { post, loading } = useSelector((state) => state.tweetDetails);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [modal, setModal] = useState(false);
  const [input, setInput] = useState("");
  const [isLiked, setIsLiked] = useState(null);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleInputChange = (e) => setInput(e.target.value);

  const handleCreateTweet = async (e) => {
    e.preventDefault();

    await createComment(input, post, user, post.postType);
    dispatch(fetchComments(post.id, post.postType));

    setInput("");
  };

  const handleLikePost = async () => {
    const likes = await dispatch(likePostDetails(post.id));
    handleIsLiked(likes);
  };

  const handleIsLiked = (likes) => {
    const liked = likes?.find((like) => like.id === user.id);
    if (liked) setIsLiked(true);
    else setIsLiked(false);
  };

  const handleUserDetails = () => {
    navigate(`/${post.username}`);
  };

  useEffect(() => {
    const fetchTweetDetails = async () => {
      const resTweet = await dispatch(getPostDetails(params.tweetId));
      handleIsLiked(resTweet.likes);
    };

    fetchTweetDetails();
  }, [params.tweetId]);

  return (
    <>
      {loading ? (
        <div className="mt-10">
          <Loader />
        </div>
      ) : (
        <div className="">
          <Modal modal={modal} closeModal={closeModal}>
            {post?.likes?.map((like) => (
              <div className="hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 p-3">
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full object-cover mr-3"
                    src="https://picsum.photos/200"
                    alt=""
                  />
                  <div className="flex justify-between mb-2 w-full">
                    <div>
                      <div className="font-bold">{like.name}</div>
                      <div className="text-gray-500 mb-1">@{like.username}</div>
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
          {post.replyToUsers?.map((post) => (
            <Tweet
              stateType="redux-repliedToPosts"
              likeTweet={likeRepliedToPost}
              key={post.id}
              id={post.id}
              tweet={post}
            />
          ))}
          <div className="flex px-4 py-3">
            <img
              onClick={handleUserDetails}
              className="h-12 w-12 rounded-full object-cover mr-3"
              src="https://picsum.photos/200"
              alt=""
            />
            <div>
              <div className="font-bold">{post.name}</div>
              <div className="text-gray-500 text-sm">@{post.username}</div>
            </div>
          </div>
          <div className="flex">
            <div className="text-gray-500 mr-1">Replying to </div>
            <div className="flex items-center">
              {" "}
              {post.replyToUsers?.map((user) => (
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
          <div className="text-xl px-4 pb-3">{post.message}</div>
          <div className="px-4 pb-3">
            <img
              className="w-full h-100 rounded-xl"
              src="https://picsum.photos/200"
              alt="Media Content"
            />
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
              onClick={handleLikePost}
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
              <UploadIcon className="h-7 w-7" />
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
            <Comments />
          </div>
        </div>
      )}
    </>
  );
};

export default TweetDetails;
