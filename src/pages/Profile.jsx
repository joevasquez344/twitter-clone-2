import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Tweet from "../components/Tweet";
import Feed from "../components/Feed";
import {
  getProfile,
  getUserTweets,
  followProfile,
  unfollowProfile,
  editProfile,
} from "../redux/users/users.actions";
import { handleActiveTab } from "../utils/handlers";
import { followUser } from "../utils/api/users";
import { db } from "../firebase/config";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  query,
} from "firebase/firestore/lite";
import { getDocs, orderBy, where, writeBatch } from "firebase/firestore";
import { toggleLikePost } from "../utils/api/posts";
import Modal from "../components/Modal";

const Profile = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { userDetails, user, loading } = useSelector((state) => state.users);
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
    return tweetsData;
  };

  const getTweetsAndReplies = async (profileId) => {
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
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...doc.data(),
      }))
    );

    setTweets(posts);

    return posts;
  };

  const getUsersLikedPosts = async (profileId) => {
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
        likes: await (
          await getDocs(collection(db, `posts/${doc.id}/likes`))
        ).docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...doc.data(),
      }))
    );

    setTweets(posts);
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
        <div>LOADING</div>
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
              <div className="flex items-center text-sm mr-4 cursor-pointer hover:underline">
                <div className="font-semibold mr-1">{following?.length}</div>
                <div className="text-gray-500">Following</div>
              </div>
              <div className="flex items-center text-sm cursor-pointer hover:underline">
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
          {tweets?.map((tweet) => (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              tweet={tweet}
              likeTweet={likeTweet}
              stateType="local"
            />
          ))}
        </>
      )}
    </>
  );
};

export default Profile;
