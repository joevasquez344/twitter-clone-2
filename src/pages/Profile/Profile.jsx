import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// import { getTweets, getTweetsAndReplies, getLikedPosts } from "./helpers";

import Tweet from "../../components/Tweet";
import Tweet2 from "../../components/Tweet2";

import Modal from "../../components/Modal";

import { handleActiveTab, handleAuthLayout } from "../../utils/handlers";

import { db } from "../../firebase/config";
import { getDocs, orderBy, where } from "firebase/firestore";

import Feed2 from "../../components/Feed2";
import {
  getPosts,
  getUsersLikedPosts,
  getTweetsAndReplies,
  followProfile,
  unfollowProfile,
  editProfile,
  refreshPost,
  toggleLikeTweet,
  getProfile,
  addPinnedPost,
  removePinnedPost,
  toggleLikePinPost,
  getPinnedPost,
  deleteTweet,
  followPostUser,
  unfollowPostUser,
} from "../../redux/profile/profile.actions";
import { getUserDetails } from "../../utils/api/users";
import ProfileFollowButton from "./ProfileFollowButton";
import ProfileTabs from "./ProfileTabs";
import Loader from "../../components/Loader";
import ProfileInfo from "./ProfileInfo";

const Profile = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const { profile, feed, profileLoading, feedLoading, pinnedPost } =
    useSelector((state) => state.profile);
  // const [feedLoading, setFeedLoading] = useState(true);

  const {
    username,
    name,
    bio,
    avatar,
    location,
    following,
    followers,
    createdAt,
    birthday,
    id,
  } = useSelector((state) => state.profile.profile);

  const [birthdayInput, setBirthdayInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  const [modal, setModal] = useState(false);
  const [tabs, setTabs] = useState([
    {
      id: 1,
      text: "Tweets",
      isActive: false,
      fetchData: (profile) => handleGetPosts(profile),
    },
    {
      id: 2,
      text: "Tweets & Replies",
      isActive: false,
      fetchData: (profile) => handleGetTweetsAndReplies(profile),
    },
    {
      id: 3,
      text: "Media",
      isActive: false,
      fetchData: (profile) => handleGetPosts(profile),
    },
    {
      id: 4,
      text: "Likes",
      isActive: false,
      fetchData: (profile) => handleGetLikedPosts(profile),
    },
  ]);

  const handleTabs = (tabId) => handleActiveTab(tabId, tabs, profile, setTabs);

  const handleLikePost = (id) => dispatch(toggleLikeTweet(id));

  const handleRefreshPost = (postId) => dispatch(refreshPost(postId));

  const handleGetPosts = async (profile) => {
    const user = await getUserDetails(profile.username);

    dispatch(getPinnedPost(user.pinnedPost?.id));
    dispatch(getPosts(profile.id));
  };

  const handleGetTweetsAndReplies = (profile) =>
    dispatch(getTweetsAndReplies(profile.id));

  const handleGetLikedPosts = (profile) =>
    dispatch(getUsersLikedPosts(profile.id));

  const handlePinPost = (postId) => {
    const currentActiveTab = tabs.find((tab) => tab.isActive);
    dispatch(addPinnedPost(postId, user.id));
    currentActiveTab.fetchData(profile);
  };

  const handleUnpinPost = (postId) => {
    const currentActiveTab = tabs.find((tab) => tab.isActive);

    dispatch(removePinnedPost(postId, user.id));

    currentActiveTab.fetchData(profile);
  };

  const handleToggleLikePinPost = (postId) =>
    dispatch(toggleLikePinPost(postId));

  const openModal = () => {
    setModal(true);

    setBirthdayInput(birthday);
    setBioInput(bio);
    setNameInput(name);
    setLocationInput(location);
  };
  const closeModal = () => setModal(false);

  const handleBirthdayChange = (e) => setBirthdayInput(e.target.value);
  const handleBioChange = (e) => setBioInput(e.target.value);
  const handleNameChange = (e) => setNameInput(e.target.value);
  const handleLocationChange = (e) => setLocationInput(e.target.value);

  const handleEditProfile = (e) => {
    e.preventDefault();

    const updatedProfile = {
      name: nameInput,
      location: locationInput,
      birthday: birthdayInput,
      bio: bioInput,
    };

    dispatch(editProfile(updatedProfile, profile.id));

    closeModal();
  };

  const handleDeletePost = (postId) => {
    dispatch(deleteTweet(postId, user.id));
  };

  const handleFollowPostUser = (uid, authId) => {
    dispatch(followPostUser(uid, authId));
  };
  const handleUnfollowPostUser = (uid, authId) => {
    dispatch(unfollowPostUser(uid, authId));
  };

  const fetchProfile = async () => {
    const profile = await dispatch(getProfile(params.username));

    setBioInput(profile.bio);
    setLocationInput(profile.location);
    setBirthdayInput(profile.birthday);
    setNameInput(profile.name);

    const updatedTabs = tabs.map((tab) => {
      tab.isActive = false;
      if (tab.id === 1) {
        tab.isActive = true;
      }
      return tab;
    });

    handleAuthLayout(profile, setIsFollowing, user);

    setTabs(updatedTabs);

    dispatch(getPinnedPost(profile.pinnedPost?.id));
    dispatch(getPosts(profile.id));
  };

  useEffect(() => {
    fetchProfile();

    console.log("RERENDER");
  }, [params.username]);

  return (
    <>
      {" "}
      {profileLoading ? (
        <div className="relative h-full w-full">
          <div className="text-center mt-5 absolute top-1/2 left-1/2">
            <div role="status">
              <svg
                className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Modal modal={modal} closeModal={closeModal} header="Edit Profile">
            <form onSubmit={handleEditProfile} className="flex flex-col p-4">
              <input
                onChange={handleNameChange}
                value={nameInput}
                type="text"
                placeholder={name || "Name"}
                className="border mb-6 p-3 rounded-md"
              />
              <input
                onChange={handleBirthdayChange}
                value={birthdayInput}
                type="date"
                className="border mb-6 p-3 rounded-md"
              />
              <input
                onChange={handleBioChange}
                value={bioInput}
                type="text"
                placeholder={bio || "Bio"}
                className="border mb-6 p-3 rounded-md"
              />
              <input
                onChange={handleLocationChange}
                value={locationInput}
                type="text"
                placeholder={location ? location : "Location"}
                className="border mb-6 p-3 rounded-md"
              />

              <button onClick={handleEditProfile}>Submit</button>
            </form>
          </Modal>
          <div className="relative mb-20">
            <img
              className="w-full h-60"
              src="https://picsum.photos/200"
              alt=""
            />
            <div className="absolute bg-white z-40 -bottom-16 left-5 rounded-full p-1">
              <img
                className="rounded-full h-32 w-32"
                src="https://picsum.photos/200"
                alt=""
              />
            </div>

            <ProfileFollowButton
              openModal={openModal}
              fetchProfile={fetchProfile}
              isFollowing={isFollowing}
              setIsFollowing={setIsFollowing}
            />
          </div>

          <ProfileInfo />

          <ProfileTabs tabs={tabs} handleTabs={handleTabs} />

          {feedLoading ? (
            <Loader />
          ) : (
            <>
              <div>
                {pinnedPost?.id &&
                pinnedPost?.uid === profile?.id &&
                tabs?.find((tab) => tab.isActive && tab.text === "Tweets") ? (
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
                    handleUnfollowPostUser={handleUnfollowPostUser}
                    handleFollowPostUser={handleFollowPostUser}
                    tabs={tabs}
                  />
                ) : null}
              </div>
              {tabs?.find((tab) => tab.isActive && tab.text === "Tweets")
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
                        handleUnfollowPostUser={handleUnfollowPostUser}
                        handleFollowPostUser={handleFollowPostUser}
                        tabs={tabs}
                      />
                    ))
                : feed?.map((post) => (
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
                      handleUnfollowPostUser={handleUnfollowPostUser}
                      handleFollowPostUser={handleFollowPostUser}
                      tabs={tabs}
                    />
                  ))}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Profile;