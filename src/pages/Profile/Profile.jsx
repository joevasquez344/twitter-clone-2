import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Tweet2 from "../../components/Tweet/Tweet2";
import Modal from "../../components/Modal";
import { handleActiveTab, handleAuthLayout } from "../../utils/handlers";
import { storage } from "../../firebase/config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { XIcon } from "@heroicons/react/outline";
import cageImage from "../../images/cage.png";

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
  deleteTweet,
  getMediaPosts,
  subtractUsersPostCount,
  unfollowPostUser,
  followPostUser,
  createPost,
  clearFeedMessage,
  setFeedMessage,
} from "../../redux/profile/profile.actions";
import { deletePost, likePost } from "../../redux/home/home.actions";
import {
  followUser,
  getUserDetails,
  unfollowUser,
} from "../../utils/api/users";
import ProfileFollowButton from "./ProfileFollowButton";
import ProfileTabs from "./ProfileTabs";
import Loader from "../../components/Loader";
import ProfileInfo from "./ProfileInfo";
import CommentModal from "../../components/CommentModal";
import {
  addBookmarkById,
  deleteBookmarkById,
  fetchPinnedPost,
  getBookmarkIds,
  getBookmarks,
  getProfilesLikedPosts,
  getUsersPostsCount,
  toggleLikePost,
} from "../../utils/api/posts";
import DefaultAvatar from "../../components/DefaultAvatar";
import ArrowButton from "../../components/Buttons/ArrowButton";
import EditProfileBanner from "./EditProfileBanner";
import EditProfileAvatar from "./EditProfileAvatar";
import EditProfileForm from "./EditProfileForm";
import ProfileHeader from "./ProfileHeader";
import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import CameraIcon from "../../components/Icons/CameraIcon";
import { pinTweet, unpinTweet } from "../../redux/users/users.actions";
import RefreshBar from "./RefreshBar";
import { resetTabsClickCount } from "../../utils/helpers";
import {
  SET_PINNED_POSTS_LIKES,
  SET_UNPINNED_POSTS_LIKES,
} from "../../redux/profile/profile.types";
import {
  DELETE_POST,
  FOLLOW_TWEET_USER,
  TOGGLE_LIKE_POST,
  UNFOLLOW_TWEET_USER,
} from "../../redux/home/home.types";

const Profile = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const loc = useLocation();
  const navigate = useNavigate();
  // console.log("Location: ", !loc.pathname.split("/")[2]);
  const { user, authsPinnedPost } = useSelector((state) => state.users);

  const {
    profile,
    feed,
    loading,
    profilePostCount,
    feedLoading,
    feedMessage,
    pinnedPost,
    tweets,
    tweetsAndReplies,
    media,
    likes,
  } = useSelector((state) => state.profile);
  const { name, bio, location, birthday } = useSelector(
    (state) => state.profile.profile
  );
  const homeFeed = useSelector((state) => state.home.posts);

  const profileUsername = window.location.pathname.split("/")[1];
  const endpoint = window.location.pathname.split("/")[2];

  console.log("Location: ", loc);

  const [bookmarks, setBookmarks] = useState([]);
  const [commentDisplay, setCommentDisplay] = useState({});
  const [commentModal, setCommentModal] = useState(false);
  const [birthdayInput, setBirthdayInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [input, setInput] = useState("");
  const [pinnedTweet, setPinnedTweet] = useState({});
  const [tweetsToRoute, setTweetsToRoute] = useState([]);
  const [postsCount, setPostsCount] = useState(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [banner, setBanner] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [modal, setModal] = useState(false);
  const [tabs, setTabs] = useState([
    {
      id: 1,
      text: "Tweets",
      pathname: undefined,
      isActive: true,
      fetchData: (profile) => handleGetPosts(profile),
      clickCount: 0,
    },
    {
      id: 2,
      text: "Tweets & Replies",
      pathname: "with_replies",
      isActive: false,
      fetchData: (profile) => handleGetTweetsAndReplies(profile),
      clickCount: 0,
    },
    {
      id: 3,
      text: "Media",
      pathname: "media",
      isActive: false,
      fetchData: (profile) => handleGetMediaPosts(profile),
      clickCount: 0,
    },
    {
      id: 4,
      text: "Likes",
      pathname: "likes",
      isActive: false,
      fetchData: (profile) => handleGetLikedPosts(profile),
      clickCount: 0,
    },
  ]);

  console.log("Tabs: ", tabs);

  const handleOpenCommentModal = (post) => {
    setCommentModal(true);
    setCommentDisplay(post);
  };

  const handleCloseCommentModal = () => setCommentModal(false);

  const handleInputChange = (e) => setInput(e.target.value);
  const handleBirthdayChange = (e) => setBirthdayInput(e.target.value);
  const handleBioChange = (e) => setBioInput(e.target.value);
  const handleNameChange = (e) => setNameInput(e.target.value);
  const handleLocationChange = (e) => setLocationInput(e.target.value);

  const clearMessage = () => dispatch(clearFeedMessage());

  const setMessage = (feedType) => dispatch(setFeedMessage(feedType));

  const handleTabs = (tabId) => {
    const feeds = [tweets, tweetsAndReplies, media, likes];

    handleActiveTab(
      tabId,
      feeds,
      tabs,
      params.username,
      setTabs,
      clearMessage,
      setMessage
    );
  };
  console.log("Tabs", tabs);
  const closeModal = () => {
    setModal(false);
    setAvatar(null);
    setAvatarUrl(null);
    setBanner(null);
    setBannerUrl(null);
  };
  const openModal = () => {
    setModal(true);

    setBirthdayInput(birthday);
    setBioInput(bio);
    setNameInput(name);
    setLocationInput(location);
    setBannerUrl(profile.banner);
    setAvatarUrl(profile.avatar);
  };

  const fetchProfile = async () => {
    const profile = await dispatch(getProfile(profileUsername));

    setBioInput(profile.bio);
    setLocationInput(profile.location);
    setBirthdayInput(profile.birthday);
    setNameInput(profile.name);

    handleAuthLayout(profile, setIsFollowing, user);

    setBannerUrl(profile.banner);
    setAvatarUrl(profile.avatar);

    return profile;
  };

  const handleRefreshPost = (postId) => dispatch(refreshPost(postId));

  const handleGetPosts = (username) => {
    dispatch(getPosts(username));
  };

  const handleGetTweetsAndReplies = (username) =>
    dispatch(getTweetsAndReplies(username));

  const handleGetMediaPosts = (username) => dispatch(getMediaPosts(username));

  const handleGetLikedPosts = (username) =>
    dispatch(getUsersLikedPosts(username));

  const handleLikePost = async (id) => {
    const postinHomeFeed = homeFeed.find((post) => post.id === id);
    if (postinHomeFeed) {
      dispatch({
        type: TOGGLE_LIKE_POST,
        payload: {
          postId: id,
          likes: postinHomeFeed.likes.find((uid) => uid === user.id)
            ? postinHomeFeed.likes.filter((uid) => uid !== user.id)
            : [...postinHomeFeed.likes, user.id],
        },
      });
    }
    const likes = await dispatch(toggleLikeTweet(id));

    if (id === pinnedTweet.id) {
      setPinnedTweet({
        ...pinnedTweet,
        likes,
      });
    }
  };

  const likePinnedPost = async (postId) => {
    const postInHomeFeed = homeFeed.find((post) => post.id === postId);
    if (postInHomeFeed) {
      dispatch({
        type: TOGGLE_LIKE_POST,
        payload: {
          postId,
          likes: postInHomeFeed.likes.find((uid) => uid === user.id)
            ? postInHomeFeed.likes.filter((uid) => uid !== user.id)
            : [...postInHomeFeed.likes, user.id],
        },
      });
    }
    const alreadyLiked = pinnedTweet?.likes.find(
      (userId) => userId === user.id
    );

    if (!alreadyLiked) {
      setPinnedTweet({
        ...pinnedTweet,
        likes: [...pinnedTweet.likes, user.id],
      });
      dispatch({
        type: SET_PINNED_POSTS_LIKES,
        payload: { ...pinnedTweet, likes: [...pinnedTweet.likes, user.id] },
      });

      await toggleLikePost(postId);
    } else {
      setPinnedTweet({
        ...pinnedTweet,
        likes: pinnedTweet.likes.filter((userId) => userId !== user.id),
      });
      dispatch({
        type: SET_UNPINNED_POSTS_LIKES,
        payload: {
          ...pinnedTweet,
          likes: pinnedTweet.likes.filter((userId) => userId !== user.id),
        },
      });

      await toggleLikePost(postId);
    }
  };
  console.log("Pinned Tweet: ", pinnedTweet);

  const handlePinPost = (post) => {
    dispatch(pinTweet(post, user.id));
    dispatch({ type: SET_PINNED_POSTS_LIKES, payload: post });
    setPinnedTweet(post);
  };

  const handleUnpinPost = (post) => {
    dispatch(unpinTweet(post, user.id));
    dispatch({ type: SET_UNPINNED_POSTS_LIKES, payload: post });
    setPinnedTweet({});
  };

  const handleAddBookmark = async (postId) => {
    setBookmarks([...bookmarks, postId]);
    await addBookmarkById(postId, user.id);
  };

  const handleRemoveBookmark = async (postId) => {
    setBookmarks(bookmarks.filter((bookmarkId) => bookmarkId !== postId));
    await deleteBookmarkById(postId, user.id);
  };

  const handleDeletePost = async (postId) => {
    const postinHomeFeed = homeFeed.find((post) => post.id === postId);
    if (postinHomeFeed) dispatch({ type: DELETE_POST, payload: postId });

    dispatch(deleteTweet(postId, user.id));

    if (postId === pinnedTweet.id) setPinnedTweet({});

    decrementTweetCount();
  };

  const handleToggleFollow = async (post) => {
    const authUsersPost = post.uid === user.id;

    const postInHomeFeed = homeFeed.find((tweet) => tweet.uid === post.uid);
    if (
      postInHomeFeed &&
      postInHomeFeed.followers.find((u) => u.id === user.id)
    ) {
      dispatch({
        type: UNFOLLOW_TWEET_USER,
        payload: {
          followers: postInHomeFeed.followers.filter((u) => u.id !== user.id),
          uid: post.uid,
        },
      });
    } else {
      dispatch({
        type: FOLLOW_TWEET_USER,
        payload: {
          followers: [...postInHomeFeed.followers, user],
          uid: post.uid,
        },
      });
    }

    if (!authUsersPost) {
      const authIsFollowing = post.followers.find((u) => u.id === user.id);

      if (authIsFollowing) {
        dispatch(unfollowPostUser(post, user));
        setPinnedTweet({
          ...pinnedTweet,
          followers: pinnedTweet.followers.filter((u) => u.id !== user.id),
        });
      } else {
        dispatch(followPostUser(post, user));
        setPinnedTweet({
          ...pinnedTweet,
          followers: [...pinnedTweet.followers, user],
        });
      }
    }

    closeModal();
  };

  const handleCreatePost = async (e, input, post, selectedImageUrl) => {
    e.preventDefault();

    const createdComment = dispatch(
      createPost(input, post, user, selectedImageUrl)
    );
    if (post.id === pinnedTweet.id) {
      setPinnedTweet({
        ...pinnedTweet,
        comments: [...pinnedTweet.comments, createdComment],
      });
    }
    incrementTweetCount();

    handleCloseCommentModal();
  };

  const handleEditProfile = (e) => {
    e.preventDefault();

    const updatedProfile = {
      name: nameInput,
      location: locationInput,
      birthday: birthdayInput,
      bio: bioInput,
      avatar: avatarUrl,
      banner: bannerUrl,
    };

    if (avatarUrl !== null) {
      uploadAvatarToStorage();
    }
    if (bannerUrl !== null) {
      uploadBannerToStorage();
    }

    dispatch(editProfile(updatedProfile, profile.id));

    closeModal();
  };

  const getAvatarUrl = (e) => {
    const fileImage = e.target.files[0];

    if (fileImage) {
      setAvatarLoading(true);
    }

    const imageRef = ref(storage, `${user.id}/selected/${fileImage.name}`);
    uploadBytes(imageRef, e.target.files[0])
      .then((res) => {
        listAll(ref(storage, `${user.id}/selected/`)).then((response) => {
          const match = response.items.find(
            (item) => item.fullPath === res.ref.fullPath
          );

          if (match) {
            setAvatar(match);
            getDownloadURL(match).then((url) => {
              setAvatarUrl(url);
              setAvatarLoading(false);
            });
          }
        });
      })
      .catch((err) => {
        alert(`Error ${err.message}`);
      });
  };
  const getBannerUrl = (e) => {
    const fileImage = e.target.files[0];

    if (fileImage) {
      setBannerLoading(true);
    }

    const imageRef = ref(storage, `${user.id}/selected/${fileImage.name}`);
    uploadBytes(imageRef, e.target.files[0])
      .then((res) => {
        listAll(ref(storage, `${user.id}/selected/`)).then((response) => {
          const match = response.items.find(
            (item) => item.fullPath === res.ref.fullPath
          );

          if (match) {
            setBanner(match);
            getDownloadURL(match).then((url) => {
              setBannerUrl(url);
              setBannerLoading(false);
            });
          }
        });
      })
      .catch((err) => {
        alert(`Error ${err.message}`);
      });
  };

  const uploadAvatarToStorage = () => {
    if (avatar === null) return;
    const imageRef = ref(storage, `${user.id}/uploaded/${avatar.name}`);

    uploadBytes(imageRef, avatar)
      .then((res) => {
        listAll(ref(storage, `${user.id}`)).then((items) => {
          const match = items.items.find(
            (item) => item.fullPath === res.ref.fullPath
          );
        });
      })
      .catch((err) => {
        alert(`Error ${err}`);
      });
  };

  const uploadBannerToStorage = () => {
    if (banner === null) return;
    const imageRef = ref(storage, `${user.id}/uploaded/${banner.name}`);

    uploadBytes(imageRef, banner)
      .then((res) => {
        listAll(ref(storage, `${user.id}`)).then((items) => {
          const match = items.items.find(
            (item) => item.fullPath === res.ref.fullPath
          );
        });
      })
      .catch((err) => {
        alert(`Error ${err}`);
      });
  };

  const removeBanner = () => {
    setBannerUrl(null);
    setBanner(null);
  };

  const removeAvatar = () => {
    setAvatarUrl(null);
    setAvatar(null);
  };

  const getAuthBookmarks = async () => {
    const bookmarkIds = await getBookmarkIds(user.id);
    console.log("Bookmark Ids: ", bookmarkIds);
    setBookmarks(bookmarkIds);
  };

  const getPinnedPost = async () => {
    const pinnedPost = await fetchPinnedPost(profileUsername);
    setPinnedTweet(pinnedPost);

    return pinnedPost;
  };

  const incrementTweetCount = () => {
    if (profile.id === user.id) {
      setPostsCount(postsCount + 1);
    }
  };
  const decrementTweetCount = () => {
    if (profile.id === user.id) {
      setPostsCount(postsCount - 1);
    }
  };

  const getData = async () => {
    getAuthBookmarks();
    const profile = await fetchProfile();

    getPinnedPost();
    handleGetPosts(params.username);

    const updatedTabs = tabs.map((tab) => {
      tab.isActive = false;
      if (tab.text === "Tweets") {
        tab.isActive = true;
      }
      return tab;
    });

    const postsCount = await getUsersPostsCount(profile.id);
    setPostsCount(postsCount);

    setTabs(updatedTabs);
  };

  useEffect(() => {
    getData();

    resetTabsClickCount(tabs, setTabs);
  }, [params.username]);

  useEffect(() => {
    handleAuthLayout(profile, setIsFollowing, user);
  }, [profile.followers]);

  // useEffect(() => {
  //   if (endpoint === "with_replies") {
  //     dispatch(getTweetsAndReplies(profileUsername));
  //   } else if (endpoint === "likes") {
  //     dispatch(getUsersLikedPosts(profileUsername));
  //   } else if (endpoint === "media") {
  //     dispatch(getMediaPosts(profileUsername));
  //   } else {
  //     dispatch(getPosts(profileUsername));
  //     // dispatch(getPinnedPost(params.username));
  //   }
  // }, [endpoint]);

  const activeTab = tabs.find((tab) => tab.isActive === true);

  return (
    <>
      {" "}
      {loading ? (
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
          <div className="">
            {modal ? (
              <div className="bg-black z-50 fixed top-0 bottom-0 left-0 right-0 opacity-40 w-screen h-screen"></div>
            ) : null}
            <Modal
              modal={modal}
              closeModal={closeModal}
              target="Edit Profile"
              headerTitle="Edit Profile"
              headerButton="Save"
              onHeaderButtonClick={handleEditProfile}
            >
              <div className="relative mb-20">
                <div className="w-full h-60">
                  <div className="absolute w-full h-60 flex space-x-4 items-center justify-center">
                    <div className="relative opacity-40 z-50 bg-black p-3 rounded-full transition sm:hover:bg-gray-400 sm:peer-hover:opacity-30 ease-in-out cursor-pointer duration-200">
                      <input
                        onChange={getBannerUrl}
                        className="absolute opacity-0 left-0 right-0 bottom-0 top-0 z-50 cursor-pointer"
                        type="file"
                      />

                      <CameraIcon styles="w-6 h-6 z-40 peer ease-in-out duration-200" />
                    </div>
                    <XIcon
                      onClick={removeBanner}
                      className="w-6 h-6 text-white z-50 cursor-pointer"
                    />
                  </div>

                  {bannerLoading ? (
                    <Loader />
                  ) : (
                    <>
                      <EditProfileBanner
                        banner={banner}
                        setBannerUrl={setBannerUrl}
                        bannerUrl={bannerUrl}
                        profile={profile}
                      />
                    </>
                  )}
                </div>
                <div className="absolute flex items-center justify-center bg-white z-50 -bottom-16 left-5 rounded-full p-1">
                  <div className="absolute opacity-40 z-50 bg-black p-6 rounded-full sm:hover:bg-gray-400 sm:peer-hover:opacity-30 transition ease-in-out cursor-pointer duration-200">
                    <input
                      onChange={getAvatarUrl}
                      className="absolute cursor-pointer opacity-0 top-0 right-0 left-0 bottom-0 z-50"
                      type="file"
                    />
                  </div>
                  <CameraIcon styles="w-6 h-6 z-40 absolute peer ease-in-out cursor-pointer duration-200" />
                  {avatarLoading ? (
                    <Loader />
                  ) : (
                    <EditProfileAvatar
                      avatar={avatar}
                      avatarUrl={avatarUrl}
                      profile={profile}
                    />
                  )}
                </div>
              </div>
              <EditProfileForm
                handleEditProfile={handleEditProfile}
                handleNameChange={handleNameChange}
                nameInput={nameInput}
                name={name}
                bio={bio}
                handleBioChange={handleBioChange}
                bioInput={bioInput}
                handleLocationChange={handleLocationChange}
                locationInput={locationInput}
                location={location}
                handleBirthdayChange={handleBirthdayChange}
                birthdayInput={birthdayInput}
              />
            </Modal>
            <ProfileHeader profile={profile} profilePostsCount={postsCount} />
            <div className="relative mb-12 sm:mb-20">
              <ProfileBanner profile={profile} />
              <ProfileAvatar profile={profile} />
              {!feedLoading && (
                <ProfileFollowButton
                  openModal={openModal}
                  fetchProfile={fetchProfile}
                  isFollowing={isFollowing}
                  setIsFollowing={setIsFollowing}
                  setPinnedTweet={setPinnedTweet}
                  pinnedTweet={pinnedTweet}
                />
              )}
            </div>

            <ProfileInfo />

            <ProfileTabs tabs={tabs} handleTabs={handleTabs} />
          </div>

          {feedLoading ? (
            <Loader />
          ) : (
            <div className="relative">
              {commentModal && (
                <CommentModal
                  post={commentDisplay}
                  handleCreateComment={handleCreatePost}
                  input={input}
                  handleInputChange={handleInputChange}
                  handleCloseCommentModal={handleCloseCommentModal}
                  refresh={handleGetPosts}
                  redux={true}
                />
              )}

              <RefreshBar activeTab={activeTab} />

              {feedMessage == null ||
              (pinnedTweet?.id && activeTab.text === "Tweets") ? null : (
                <div className="absolute top-15 w-1/2 left-1/4 overflow-visible">
                  <img src={cageImage} alt="" />
                  <div className="text-2xl font-bold">{feedMessage.header}</div>
                  <div className="text-gray-500">
                    Don’t let the good ones fly away! Bookmark Tweets to easily
                    find them again in the future.
                  </div>
                </div>
              )}

              <div>
                {pinnedTweet?.id &&
                  pinnedTweet?.uid === profile?.id &&
                  tabs?.find(
                    (tab) => tab.isActive && tab.text === "Tweets"
                  ) && (
                    <Tweet2
                      key={pinnedTweet.id}
                      id={pinnedTweet.id}
                      post={pinnedTweet}
                      isPinned={true}
                      fetchProfile={fetchProfile}
                      handleLikePost={likePinnedPost}
                      handleRefreshPost={handleRefreshPost}
                      handlePinPost={handlePinPost}
                      handleUnpinPost={handleUnpinPost}
                      handleFollowUser={handleToggleFollow}
                      handleDeletePost={handleDeletePost}
                      handleAddBookmark={handleAddBookmark}
                      handleRemoveBookmark={handleRemoveBookmark}
                      handleOpenCommentModal={handleOpenCommentModal}
                      tabs={tabs}
                      bookmarks={bookmarks}
                    />
                  )}
              </div>
              {tabs?.find((tab) => tab.isActive && tab.text === "Tweets") ? (
                <div>
                  {tweets
                    .filter((post) => post.id !== pinnedTweet?.id)
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
                        handleAddBookmark={handleAddBookmark}
                        handleRemoveBookmark={handleRemoveBookmark}
                        handleFollowUser={handleToggleFollow}
                        handleOpenCommentModal={handleOpenCommentModal}
                        tabs={tabs}
                        bookmarks={bookmarks}
                      />
                    ))}
                  {tweets.length > 10 && (
                    <div className="p-4 text-sm flex justify-center items-center text-blue-400 border-b font-semibold hover:bg-blue-50 transition ease-in-out cursor-pointer duration-200">
                      Show More
                    </div>
                  )}
                </div>
              ) : tabs?.find(
                  (tab) => tab.isActive && tab.text === "Tweets & Replies"
                ) ? (
                <div>
                  {tweetsAndReplies.map((post) => (
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
                      handleAddBookmark={handleAddBookmark}
                      handleRemoveBookmark={handleRemoveBookmark}
                      handleFollowUser={handleToggleFollow}
                      handleOpenCommentModal={handleOpenCommentModal}
                      tabs={tabs}
                      bookmarks={bookmarks}
                    />
                  ))}
                  {tweetsAndReplies.length > 10 && (
                    <div className="p-4 text-sm flex justify-center items-center text-blue-400 border-b font-semibold hover:bg-blue-50 transition ease-in-out cursor-pointer duration-200">
                      Show More
                    </div>
                  )}
                </div>
              ) : tabs?.find((tab) => tab.isActive && tab.text === "Media") ? (
                <div>
                  {media.map((post) => (
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
                      handleAddBookmark={handleAddBookmark}
                      handleRemoveBookmark={handleRemoveBookmark}
                      handleFollowUser={handleToggleFollow}
                      handleOpenCommentModal={handleOpenCommentModal}
                      tabs={tabs}
                      bookmarks={bookmarks}
                    />
                  ))}
                  {media.length > 10 && (
                    <div className="p-4 text-sm flex justify-center items-center text-blue-400 border-b font-semibold hover:bg-blue-50 transition ease-in-out cursor-pointer duration-200">
                      Show More
                    </div>
                  )}
                </div>
              ) : tabs?.find((tab) => tab.isActive && tab.text === "Likes") ? (
                <div>
                  {likes.map((post) => (
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
                      handleAddBookmark={handleAddBookmark}
                      handleRemoveBookmark={handleRemoveBookmark}
                      handleFollowUser={handleToggleFollow}
                      handleOpenCommentModal={handleOpenCommentModal}
                      tabs={tabs}
                      bookmarks={bookmarks}
                    />
                  ))}
                  {likes.length > 10 && (
                    <div className="p-4 text-sm flex justify-center items-center text-blue-400 border-b font-semibold hover:bg-blue-50 transition ease-in-out cursor-pointer duration-200">
                      Show More
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </>
    //  <div className="p-4 text-sm flex justify-center items-center text-blue-400 border-b font-semibold hover:bg-blue-50 transition ease-in-out cursor-pointer duration-200">Show More</div>
  );
};

export default Profile;
