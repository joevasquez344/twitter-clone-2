import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Tweet2 from "../../components/Tweet/Tweet2";

import {
  getPosts,
  getUsersLikedPosts,
  getTweetsAndReplies,
  editProfile,
  refreshPost,
  toggleLikeTweet,
  getProfile,
  addPinnedPost,
  removePinnedPost,
  toggleLikePinPost,
  getPinnedPost,
  deleteTweet,
  getMediaPosts,
  subtractUsersPostCount,
} from "../../redux/profile/profile.actions";
import { followUser, unfollowUser } from "../../utils/api/users";

const ProfileFeed = ({
  tabs,
  fetchProfile,
  closeModal,
  bookmarks,
  handleOpenCommentModal,
}) => {
  const { profile, pinnedPost, feed } = useSelector((state) => state.profile);
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(null);

  const handleLikePost = (id) => dispatch(toggleLikeTweet(id));

  const handlePinPost = (postId) => dispatch(addPinnedPost(postId, user.id));

  const handleUnpinPost = (postId) =>
    dispatch(removePinnedPost(postId, user.id));

  const handleToggleLikePinPost = (postId) =>
    dispatch(toggleLikePinPost(postId));

  const handleDeletePost = async (postId) => {
    dispatch(deleteTweet(postId, user.id));
    dispatch(subtractUsersPostCount());
  };
  const handleRefreshPost = (postId) => dispatch(refreshPost(postId));

  const handleToggleFollow = async (post) => {
    const authUsersPost = post.uid === user.id;

    if (!authUsersPost) {
      const authIsFollowing = post.followers.find((u) => u.id === user.id);

      if (authIsFollowing) {
        await unfollowUser(post.uid, user.id);

        fetchProfile();
      } else {
        await followUser(post.uid, user.id);

        fetchProfile();
      }
    }

    // fetchProfile();
    closeModal();
  };

  useEffect(() => {
    let cancel = false;
    const activeTab = tabs.find((tab) => tab.isActive === true);

    // const fetchData = async () => {
    //   await activeTab.fetchData(profile);
    // };

    // fetchData();
  }, []);

  return (
    <div className="relative">
      <div>
        {pinnedPost?.id &&
          pinnedPost?.uid === profile?.id &&
          tabs?.find((tab) => tab.isActive && tab.text === "Tweets") && (
            <Tweet2
              key={pinnedPost.id}
              id={pinnedPost.id}
              post={pinnedPost}
              isPinned={true}
              fetchProfile={fetchProfile}
              handleLikePost={handleToggleLikePinPost}
              handleRefreshPost={handleRefreshPost}
              handlePinPost={handlePinPost}
              handleUnpinPost={handleUnpinPost}
              handleFollowUser={handleToggleFollow}
              handleDeletePost={handleDeletePost}
              handleOpenCommentModal={handleOpenCommentModal}
              tabs={tabs}
              bookmarks={bookmarks}
            />
          )}
      </div>
      {tabs?.find((tab) => tab.isActive === true && tab.text === "Tweets")
        ? feed
            .filter((post) => post.id !== pinnedPost?.id)
            .map((post) => (
              <Tweet2
                key={post.id}
                id={post.id}
                post={post}
                isPinned={false}
                handleLikePost={handleLikePost}
                handleRefreshPost={handleRefreshPost}
                fetchProfile={fetchProfile}
                handlePinPost={handlePinPost}
                handleUnpinPost={handleUnpinPost}
                handleDeletePost={handleDeletePost}
                handleFollowUser={handleToggleFollow}
                handleOpenCommentModal={handleOpenCommentModal}
                tabs={tabs}
                bookmarks={bookmarks}
              />
            ))
        : feed.map((post) => (
            <Tweet2
              key={post.id}
              id={post.id}
              post={post}
              isPinned={post.id === pinnedPost?.id}
              handleLikePost={handleLikePost}
              handleRefreshPost={handleRefreshPost}
              fetchProfile={fetchProfile}
              handlePinPost={handlePinPost}
              handleUnpinPost={handleUnpinPost}
              handleDeletePost={handleDeletePost}
              handleFollowUser={handleToggleFollow}
              handleOpenCommentModal={handleOpenCommentModal}
              tabs={tabs}
              bookmarks={bookmarks}
            />
          ))}
    </div>
  );
};

export default ProfileFeed;
