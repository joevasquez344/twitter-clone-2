import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Tweet2 from "../../components/Tweet/Tweet2";
import Modal from "../../components/Modal";
import { handleActiveTab, handleAuthLayout } from "../../utils/handlers";
import { storage } from "../../firebase/config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { XIcon } from "@heroicons/react/outline";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore/lite";
import { db } from "../../firebase/config";

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
import { createComment } from "../../utils/api/comments";
import {
  fetchPinnedPost,
  fetchProfileMediaPosts,
  fetchProfileTweets,
  fetchProfileTweetsAndReplies,
  getBookmarks,
  getComments,
} from "../../utils/api/posts";
import EditProfileBanner from "./EditProfileBanner";
import EditProfileAvatar from "./EditProfileAvatar";
import EditProfileForm from "./EditProfileForm";
import ProfileHeader from "./ProfileHeader";
import ProfileBanner from "./ProfileBanner";
import ProfileAvatar from "./ProfileAvatar";
import CameraIcon from "../../components/Icons/CameraIcon";
import ProfileFeed from "./ProfileFeed";

const Profile = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  const [profile, setProfile] = useState(null);
  const [feed, setFeed] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [postCount, setPostCount] = useState(null);
  const [commentDisplay, setCommentDisplay] = useState({});
  const [commentModal, setCommentModal] = useState(false);
  const [birthdayInput, setBirthdayInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [pinnedPost, setPinnedPost] = useState(null);

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
      fetchData: (profile) => handleGetMediaPosts(profile),
    },
    {
      id: 4,
      text: "Likes",
      isActive: false,
      fetchData: (profile) => handleGetLikedPosts(profile),
    },
  ]);

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

  const handleTabs = (tabId) => handleActiveTab(tabId, tabs, profile, setTabs);

  const closeModal = () => {
    setModal(false);
    setAvatar(null);
  };
  const openModal = () => {
    setModal(true);

    setBirthdayInput(profile.birthday);
    setBioInput(profile.bio);
    setNameInput(profile.name);
    setLocationInput(profile.location);
    setBannerUrl(profile.banner);
    setAvatarUrl(profile.avatar);
  };

  const fetchProfile = async () => {
    const profile = await getUserDetails(params.username);

    const tweets = await fetchProfileTweets(profile.id);
    const pinnedPost = await fetchPinnedPost(profile.id);

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

    setBannerUrl(profile.banner);
    setAvatarUrl(profile.avatar);

    setProfile(profile);
    setFeed(tweets);
    setPinnedPost(pinnedPost);

    setLoading(false);
  };

  const handleGetPosts = async (profile) => {
    const posts = await fetchProfileTweets(profile.id);

    setFeed(posts);
  };

  const handleGetTweetsAndReplies = async (profile) => {
    const posts = await fetchProfileTweetsAndReplies(profile.id);
    setFeed(posts);
  };

  const handleGetMediaPosts = async (profile) => {
    const posts = await fetchProfileMediaPosts(profile.id);

    setFeed(posts);
  };

  const handleGetLikedPosts = async (profile) => {
    const likesRef = collection(db, `users/${profile.id}/likes`);
    const postIds = await getDocs(likesRef);

    const postDocs = await Promise.all(
      postIds.docs.map(
        async (post) => await getDoc(doc(db, `posts/${post.id}`))
      )
    );

    const posts = await Promise.all(
      postDocs
        .filter((post) => post._document !== null)
        .map(async (doc) => ({
          id: doc.id,
          followers: await (
            await getDocs(collection(db, `users/${doc.data().uid}/followers`))
          ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          likes: await (
            await getDocs(collection(db, `posts/${doc.id}/likes`))
          ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
          ...doc.data(),
          comments: await getComments(doc.id),
        }))
    );

    setFeed(posts);
  };

  const createPost = async (e, post) => {
    e.preventDefault();

    handleCloseCommentModal();
    await createComment(input, post, user, post.postType);
    setInput("");
    fetchProfile();
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
    handleGetPosts(profile);

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
  };

  const getAuthBookmarks = async () => {
    const bookmarks = await getBookmarks(user.id);
    setBookmarks(bookmarks);
  };

  useEffect(() => {
    getAuthBookmarks();
    fetchProfile();
  }, [params.username]);

  console.log("Selected Banner URL: ", bannerUrl);

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
                    <div className=" opacity-40 z-50 bg-black p-3 rounded-full transition ease-in-out cursor-pointer duration-200">
                      <div>
                        <input
                          onChange={getBannerUrl}
                          className="absolute opacity-0 w-6 h-6 cursor-pointer"
                          type="file"
                        />
                      </div>
                      <CameraIcon styles="w-6 h-6 opacity-100 z-50 peer ease-in-out cursor-pointer duration-200" />
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
                        bannerUrl={bannerUrl}
                        profile={profile}
                      />
                    </>
                  )}
                </div>
                <div className="absolute flex items-center justify-center bg-white z-40 -bottom-16 left-5 rounded-full p-1">
                  <div className="absolute opacity-40 bg-black p-6 rounded-full peer-hover:opacity-30 transition ease-in-out cursor-pointer duration-200">
                    <input
                      onChange={getAvatarUrl}
                      className="absolute opacity-0"
                      type="file"
                    />
                  </div>
                  <CameraIcon styles="w-6 h-6 absolute peer ease-in-out cursor-pointer duration-200" />
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
                name={profile.name}
                bio={profile.bio}
                handleBioChange={handleBioChange}
                bioInput={bioInput}
                handleLocationChange={handleLocationChange}
                locationInput={locationInput}
                location={profile.location}
                handleBirthdayChange={handleBirthdayChange}
                birthdayInput={birthdayInput}
              />
            </Modal>
            <ProfileHeader profile={profile} profilePostCount={postCount} />
            <div className="relative mb-20">
              <ProfileBanner profile={profile} />
              <ProfileAvatar profile={profile} />
              <ProfileFollowButton
                openModal={openModal}
                fetchProfile={fetchProfile}
                isFollowing={isFollowing}
                setIsFollowing={setIsFollowing}
              />
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
                  createPost={createPost}
                  input={input}
                  handleInputChange={handleInputChange}
                  handleCloseCommentModal={handleCloseCommentModal}
                  refresh={handleGetPosts}
                />
              )}

              <ProfileFeed
                tabs={tabs}
                fetchProfile={fetchProfile}
                closeModal={closeModal}
                handleOpenCommentModal={handleOpenCommentModal}
                bookmarks={bookmarks}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Profile;
