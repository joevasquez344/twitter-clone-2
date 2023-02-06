import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchComments } from "../../../utils/api/comments";
import {
  fetchPinnedPost,
  getPostById,
  getPostsByThreadId,
  pinPost,
  toggleLikePost,
  unpinPost,
} from "../../../utils/api/posts";
import { useSelector } from "react-redux";

const useTweet = () => {
  const authUser = useSelector((state) => state.users.user);
  const params = useParams();

  const [replyThread, setReplyThread] = useState([]);
  const [tweetDetails, setTweetDetails] = useState([]);
  const [comments, setComments] = useState([]);
  const [pinnedTweet, setPinnedTweet] = useState({});

  const getReplyThread = async () => {
    let { posts, deletedPostIds } = await getPostsByThreadId(params.tweetId);
    setReplyThread(posts);
  };

  const getTweetDetails = async () => {
    const tweetDetails = await getPostById(params.tweetId);
    setTweetDetails(tweetDetails);
  };

  const getComments = async () => {
    const comments = await fetchComments(params.tweetId);
    setComments(comments);
  };

  const getPinnedPost = async () => {
    const pinnedTweet = await fetchPinnedPost(authUser.username);
    if (pinnedTweet.id) {
      setPinnedTweet(pinnedTweet);
    }
  };

  const toggleLikeReplyThreadTweet = async (tweet) => {
    const updatedReplyThread = replyThread.map((post) => {
      if (post.id === tweet.id) {
        const match = post.likes.find((user) => user.id === authUser.id);
        if (match) {
          post.likes = post.likes.filter((user) => user.id !== authUser.id);
        } else {
          post.likes = [authUser, ...post.likes];
        }
      }

      return post;
    });

    setReplyThread(updatedReplyThread);

    await toggleLikePost(tweet.id);
  };

  const toggleLikeTweetDetails = async () => {
    const alreadyLiked = tweetDetails.likes.find((user) => user.id === authUser.id);
    if (alreadyLiked) {
      setTweetDetails({
        ...tweetDetails,
        likes: tweetDetails.likes.filter((user) => user.id !== authUser.id),
      });
    } else {
      setTweetDetails({
        ...tweetDetails,
        likes: [authUser, ...tweetDetails.likes],
      });
    }
  };

  const toggleLikeComment = async (comment) => {
    const updatedComments = comments.map(async (post) => {
      if (post.id === comment.id) {
        const alreadyLiked = post.likes.find((user) => user.id === authUser.id);
        if (alreadyLiked) {
          post.likes = post.likes.filter((user) => user.id !== authUser.id);
        } else {
          post.likes = [authUser, ...post.likes];
        }
      }

      return post;
    });

    setComments(updatedComments);

    await toggleLikePost(comment.id);
  };

  const pinTweet = async (tweet) => {
    await pinPost(tweet.id, authUser.id);
    setPinnedTweet(tweet);
  };
  const unpinTweet = async (tweet) => {
    await unpinPost(tweet.id, authUser.id);
    setPinnedTweet({});
  };

  const deleteTweet = async (tweet) => {};

  const followTweetUser = async (tweet) => {};

  return {
    replyThread,
    tweetDetails,
    comments,
    pinnedTweet,

    getReplyThread,
    getTweetDetails,
    getComments,
    getPinnedPost,

    toggleLikeReplyThreadTweet,
    toggleLikeTweetDetails,
    toggleLikeComment,
    pinTweet,
    unpinTweet,
  };
};

export default useTweet;

// ---- Use for post followers ------
//   const updateFeeds = (tweet) => {
//     const updatedReplyThread = replyThread.map((post) => {
//       if (post.id === tweet.id) {
//         const match = post.likes.find((u) => u.id === user.id);
//         if (match) {
//           post.likes = post.likes.filter((u) => u.id !== user.id);
//         } else {
//           post.likes = [...post.likes, user];
//         }
//       }

//       return post;
//     });

//     const updatedPostDetails = {
//       ...tweetDetails,
//       likes: tweetDetails.likes.find((u) => u.id === user.id)
//         ? tweetDetails.likes.filter((u) => u.id !== user.id)
//         : [...tweetDetails.likes, user],
//     };

//     const updatedComments = comments.map(async (post) => {
//       if (post.id === tweet.id) {
//         const match = post.likes.find((u) => u.id === user.id);
//         if (match) {
//           post.likes = post.likes.filter((u) => u.id !== user.id);
//         } else {
//           post.likes = [...post.likes, user];
//         }
//       }

//       return post;
//     });

//     setReplyThread(updatedComments);

//     setReplyThread(updatedReplyThread);
//   };
