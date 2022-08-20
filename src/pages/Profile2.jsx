import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Tweet from "../components/Tweet";
import Modal from "../components/Modal";

import {
  getProfile,
  followProfile,
  unfollowProfile,
  editProfile,
} from "../redux/users/users.actions";

import { handleActiveTab } from "../utils/handlers";

import { db } from "../firebase/config";
import { getDocs, orderBy, where } from "firebase/firestore";
import { toggleLikePost } from "../utils/api/posts";
import { collection, doc, getDoc, query } from "firebase/firestore/lite";

const Profile2 = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userDetails, user, loading } = useSelector((state) => state.users);
  const [feedLoading, setFeedLoading] = useState(true);

  const [tweets, setTweets] = useState([]);
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
  } = useSelector((state) => state.users.userDetails);

  const [birthdayInput, setBirthdayInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [modal, setModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [tabs, setTabs] = useState([
    {
      id: 1,
      text: "Tweets",
      isActive: false,
      fetchData: async (profileId) => await getTweets(profileId),
    },
    {
      id: 2,
      text: "Tweets & Replies",
      isActive: false,
      fetchData: async (profileId) => await getTweetsAndReplies(profileId),
    },
    {
      id: 3,
      text: "Media",
      isActive: false,
      fetchData: async (profileId) => await getTweets(profileId),
    },
    {
      id: 4,
      text: "Likes",
      isActive: false,
      fetchData: async (profileId) => await getUsersLikedPosts(profileId),
    },
  ]);

  const handleTabs = (tabId) =>
    handleActiveTab(tabId, tabs, userDetails, setTabs);

  const handleAuthLayout = (profile) => {
    const match = profile?.followers?.find((u) => u.id === user.id);

    if (match) {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  };

  const handleFollowProfile = async () => {
    const profile = await dispatch(followProfile(userDetails.id, user.id));
    handleAuthLayout(profile);
  };

  const handleUnfollowProfile = async () => {
    const profile = await dispatch(unfollowProfile(userDetails.id, user.id));
    handleAuthLayout(profile);
  };

  const likeTweet = async (id) => {
    const likes = await toggleLikePost(id);

    const updatedTweets = tweets.map((tweet) => {
      if (tweet.id === id) {
        tweet.likes = likes;
      }

      return tweet;
    });

    setTweets(updatedTweets);
  };

  const getTweets = async (profileId) => {
    setFeedLoading(true);
    const tweetsRef = collection(db, `posts`);
    const tweetsQuery = query(
      tweetsRef,
      where("uid", "==", profileId),
      where("postType", "==", "tweet"),
      orderBy("timestamp", "desc")
    );
    const tweetsData = await Promise.all(
      await (
        await getDocs(tweetsQuery)
      ).docs.map(async (doc) => ({
        id: doc.id,
        followers: await (
          await getDocs(collection(db, `users/${doc.data().uid}/followers`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...doc.data(),
      }))
    );
    setTweets(tweetsData);

    setFeedLoading(false);
    return tweetsData;
  };

  const getTweetsAndReplies = async (profileId) => {
    setFeedLoading(true);

    const postsRef = collection(db, `posts`);
    const userRef = doc(db, `users/${profileId}`);

    const postsQuery = query(
      postsRef,
      where("userRef", "==", userRef),
      orderBy("timestamp", "desc")
    );
    const posts = await Promise.all(
      await (
        await getDocs(postsQuery)
      ).docs.map(async (doc) => ({
        id: doc.id,
        followers: await (
          await getDocs(collection(db, `users/${doc.data().uid}/followers`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...doc.data(),
      }))
    );

    setTweets(posts);
    setFeedLoading(false);

    return posts;
  };

  const getUsersLikedPosts = async (profileId) => {
    setFeedLoading(true);

    const likesRef = collection(db, `users/${profileId}/likes`);
    const postIds = await getDocs(likesRef);

    const postDocs = await Promise.all(
      postIds.docs.map(
        async (post) => await getDoc(doc(db, `posts/${post.id}`))
      )
    );

    const posts = await Promise.all(
      postDocs.map(async (doc) => ({
        id: doc.id,
        followers: await (
          await getDocs(collection(db, `users/${doc.data().uid}/followers`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...doc.data(),
      }))
    );

    setTweets(posts);
    setFeedLoading(false);
  };

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

    dispatch(editProfile(updatedProfile, userDetails.id));

    closeModal();
  };

  const handleFollowersRoute = () =>
    navigate(`/${userDetails.username}/followers`);

  const handleFollowingRoute = () =>
    navigate(`/${userDetails.username}/following`);

  useEffect(() => {
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

      handleAuthLayout(profile);

      setTabs(updatedTabs);

      const userTweets = await getTweets(profile.id);
      setTweets(userTweets);
    };

    fetchProfile();
  }, [params.username]);

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

            {user.id === userDetails.id ? (
              <button
                onClick={openModal}
                className="absolute right-5 mt-3 border rounded-full px-5 py-1 font-semibold"
              >
                Edit Profile
              </button>
            ) : (
              <div>
                {isFollowing ? (
                  <button
                    onClick={handleUnfollowProfile}
                    className="absolute right-5 mt-3 border rounded-full px-5 py-1 font-semibold"
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    onClick={handleFollowProfile}
                    className="absolute right-5 mt-3 border rounded-full px-5 py-1 font-semibold"
                  >
                    Follow
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="font-bold text-lg">{name}</div>
            <div className="text-gray-500 mb-2">@{username}</div>
            <div className="mb-2">{bio}</div>
            <div className="flex items-center mb-2 text-gray-500">
              <div className="mr-3">{location}</div>
              <div>{createdAt}</div>
            </div>
            <div className="flex items-center mb-2">
              <div
                onClick={handleFollowingRoute}
                className="flex items-center text-sm mr-4 cursor-pointer hover:underline"
              >
                <div className="font-semibold mr-1">{following?.length}</div>
                <div className="text-gray-500">Following</div>
              </div>
              <div
                onClick={handleFollowersRoute}
                className="flex items-center text-sm cursor-pointer hover:underline"
              >
                <div className="font-semibold mr-1">{followers?.length}</div>
                <div className="text-gray-500">Followers</div>
              </div>
            </div>
          </div>

          <div className="items-center flex justify-evenly grid-cols-4">
            {tabs?.map((tab) => (
              <div
                key={tab.id}
                onClick={() => handleTabs(tab.id)}
                className={`w-full flex justify-center border-b ${
                  tab.isActive ? "text-black-500" : "text-gray-500"
                } font-semibold py-4 hover:bg-gray-200 transition ease-in-out cursor-pointer duration-200 ${
                  tab.isActive ? "border-b-4 border-blue-500" : ""
                }`}
              >
                {tab.text}
              </div>
            ))}
          </div>
          {feedLoading ? (
            <div className="text-center mt-5 top-1/2 left-1/2">
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
          ) : (
            tweets?.map((tweet) => (
              <Tweet
                key={tweet.id}
                id={tweet.id}
                tweet={tweet}
                likeTweet={likeTweet}
                stateType="local"
              />
            ))
          )}
        </>
      )}
    </>
  );
};

export default Profile2;
