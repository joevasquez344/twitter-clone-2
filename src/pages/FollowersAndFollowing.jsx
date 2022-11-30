import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DotsHorizontalIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import {
  followUser,
  getFollowers,
  getProfileFollowing,
  getUserDetails,
  unfollowUser,
} from "../utils/api/users";
import Loader from "../components/Loader";
import ArrowButton from "../components/Buttons/ArrowButton";

// TODOs:
// Route back
const FollowersAndFollowing = () => {
  const location = useLocation();
  const { username } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [listType, setListType] = useState(null);
  const [profile, setProfile] = useState({});

  const [headers, setHeaders] = useState([
    { id: 1, label: "Following", isActive: false },
    { id: 2, label: "Followers", isActive: false },
  ]);

  const endpoint = location.pathname.split("/")[2];

  const handleHeaders = (label) => {
    const updatedHeaders = headers.map((header) => {
      header.isActive = false;
      if (header.label === label) {
        header.isActive = true;
      }

      return header;
    });

    return updatedHeaders;
  };

  const handleUserDetails = (username) => navigate(`/${username}`);

  const handleHeaderRoute = (label) => {
    navigate(`/${username}/${label.toLowerCase()}`);
  };

  const handleToggleFollow = async (userId) => {
    const authUser = profile.id === user.id;

    const profileAlreadyFollows = users.find((u) => u.id === profile.id);

    // For Auth User
    if (authUser) {
      if (userId === authUser.id) {
        await unfollowUser(profile.id, user.id);
      }
    }

    // For Non Auth User
    if (!authUser) {
    }
  };

  const handleUnfollowUser = async (profileId) => {
    await unfollowUser(profileId, user.id);

    fetchData();
  };
  const handleFollowUser = async (profileId) => {
    await followUser(profileId, user.id);

    fetchData();
  };

  const fetchData = async () => {
    const profile = await getUserDetails(username);
    setProfile(profile);

    const authId = user.id;
    const profileId = profile.id;

    let authsFollowers = await getFollowers(authId);
    let authsFollowing = await getProfileFollowing(authId);

    // If this page is related to the Auth User
    if (profileId === authId) {
      if (endpoint === "followers") {
        authsFollowers = authsFollowers.map((follower) => {
          follower.followedByAuthUser = false;

          authsFollowing.forEach((follow) => {
            if (follow.id === follower.id) {
              // Display unfollow
              follower.followedByAuthUser = true;
              setIsFollowing(true);
            }
          });

          if (follower.id === authId) {
            follower.followedByAuthUser = null;
          }

          return follower;
        });

        const updatedHeaders = handleHeaders("Followers");

        setUsers(authsFollowers);
        setHeaders(updatedHeaders);
        setListType("followers");
      } else if (endpoint === "following") {
        authsFollowing = authsFollowing.map((follow) => {
          follow.followedByAuthUser = true;
          follow.followsYou = false;

          authsFollowers.forEach((follower) => {
            if (follower.id === follow.id) {
              // Display 'Follows You' badge
              follow.followsYou = true;
            }
            return follower;
          });

          if (follow.id === authId) {
            follow.followedByAuthUser = null;
          }

          return follow;
        });

        const updatedHeaders = handleHeaders("Following");

        setUsers(authsFollowing);
        setHeaders(updatedHeaders);
        setListType("following");
      }
    }

    if (profileId !== authId) {
      let profileFollowers = await getFollowers(profile.id);
      let profileFollowing = await getProfileFollowing(profile.id);

      if (endpoint === "followers") {
        profileFollowers = profileFollowers.map((follower) => {
          if (follower.id === authId) {
            follower.followedByAuthUser = null;
            follower.followsYou = true;

            return follower;
          } else {
            follower.followsYou = false;

            const match = authsFollowing.find(
              (following) => following.id === follower.id
            );

            if (match) {
              follower.followedByAuthUser = true;
            } else {
              follower.followedByAuthUser = false;
            }

            return follower;
          }
        });

        const updatedHeaders = handleHeaders("Followers");

        setUsers(profileFollowers);
        setHeaders(updatedHeaders);
        setListType("followers");
      } else if (endpoint === "following") {
        profileFollowing = profileFollowing.map((follow) => {
          follow.followedByAuthUser = false;
          follow.followsYou = false;

          authsFollowing.forEach((follower) => {
            if (follower.id === follow.id) {
              follow.followedByAuthUser = true;
            }
          });

          authsFollowers.forEach((u) => {
            if (u.id === follow.id && follow.id !== authId) {
              follow.followsYou = true;
            }
          });

          if (follow.id === authId) {
            follow.followedByAuthUser = null;
          }

          return follow;
        });

        const updatedHeaders = handleHeaders("Following");

        setUsers(profileFollowing);
        setHeaders(updatedHeaders);
        setListType("following");
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [endpoint]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="p-3 flex items-center">
            <div className="mr-8">
              <ArrowButton />
            </div>

            <div>
              <div className="font-bold text-xl">{profile?.name}</div>
              <div className="text-gray-500 text-sm">@{profile?.username}</div>
            </div>
          </div>
          <div className="flex border-b">
            {headers.map((header) => (
              <div
                onClick={() => handleHeaderRoute(header.label)}
                className={`w-1/2 py-4 flex items-center justify-center cursor-pointer ${
                  header.isActive
                    ? "border-b-blue-500 border-b-4 font-semibold text-black"
                    : "border-none text-gray-500 font-semibold"
                } hover:bg-gray-200 transition ease-in-out cursor-pointer duration-200`}
                key={header.id}
              >
                {header.label}
              </div>
            ))}
          </div>
          <div>
            {users?.map((u) => (
              <div
                className="flex p-3 hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200"
                key={u.id}
              >
                <img
                  onClick={() => handleUserDetails(u.username)}
                  className="h-12 w-12 rounded-full object-cover mr-3"
                  src="https://picsum.photos/200"
                  alt=""
                />
                <div className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="w-full">
                      <div className="font-bold">{u.name}</div>
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-1">@{u.username}</div>
                        {u.followsYou === true && u.id !== user.id ? (
                          <div className="text-xs px-1 bg-gray-100 text-gray-500 font-semibold rounded-lg">
                            Follows you
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center relative">
                      {u.followedByAuthUser === true ? (
                        <div
                          onClick={() => handleUnfollowUser(u.id)}
                          className="mr-3 py-1 px-5 border border-gray-300 rounded-full font-semibold hover:text"
                        >
                          Unfollow
                        </div>
                      ) : u.followedByAuthUser === false ? (
                        <div
                          onClick={() => handleFollowUser(u.id)}
                          className="mr-3 py-1 px-5 bg-black text-white rounded-full font-semibold"
                        >
                          Follow
                        </div>
                      ) : u.followedByAuthUser === null ? null : null}

                      {user.id !== u.id && (
                        <div
                          // onClick={openModal}
                          className="w-9 h-9 flex group items-center justify-center  right-0 rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
                        >
                          <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>{u.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FollowersAndFollowing;
