import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DotsHorizontalIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import { useSelector } from "react-redux";
import {
  getProfileFollowers,
  getProfileFollowing,
  getUserDetails,
} from "../utils/api/users";

const FollowersAndFollowing = () => {
  const location = useLocation();
  const { username } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);

  const [users, setUsers] = useState([]);
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
  useEffect(() => {
    const fetchData = async () => {
      const profile = await getUserDetails(username);
      setProfile(profile);

      // If this page is related to the Auth User
      if (profile.id === user.id) {
        let followers = await getProfileFollowers(profile);
        let following = await getProfileFollowing(profile);

        if (endpoint === "followers") {
          followers = followers.map((follower) => {
            follower.authUserIsFollowing = false;
            follower.followsYou = false;

            following.map((follow) => {
              if (follower.id === follow.id) {
                follower.authUserIsFollowing = true;
              }

              return follow;
            });

            if (follower.id === user.id) {
              follower.authUserIsFollowing = true;
            }

            return follower;
          });

          const updatedHeaders = handleHeaders("Followers");

          setUsers(followers);
          setHeaders(updatedHeaders);
        } else if (endpoint === "following") {
          following = following.map((follow) => {
            follow.authUserIsFollowing = true;
            follow.followsYou = false;

            followers = followers.map((follower) => {
              follow.followsYou = false;
              if (follow.id === follower.id) {
                follow.followsYou = true;
              }
              return follower;
            });

            return follow;
          });

          const updatedHeaders = handleHeaders("Following");

          setUsers(following);
          setHeaders(updatedHeaders);
        }
      }
    };
    fetchData();
  }, [endpoint]);
  return (
    <div>
      <div className="p-5 flex items-center">
        <ArrowLeftIcon className="h-5 w-5 mr-8" />

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
        {users?.map((user) => (
          <div
            className="flex p-5 hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200"
            key={user.id}
          >
            <img
              onClick={() => handleUserDetails(user.username)}
              className="h-12 w-12 rounded-full object-cover mr-3"
              src="https://picsum.photos/200"
              alt=""
            />
            <div className="w-full">
              <div className="flex items-center justify-between w-full">
                <div className="w-full">
                  <div className="font-bold">{user.name}</div>
                  <div className="flex items-center">
                    <div className="text-gray-500 mr-1">@{user.username}</div>
                    {user.followsYou ? (
                      <div className="text-xs px-1 bg-gray-100 text-gray-500 font-semibold rounded-lg">
                        Follows you
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center">
                  {user.authUserIsFollowing ? (
                    <div className="mr-3 py-1 px-5 border rounded-full font-semibold">
                      Unfollow
                    </div>
                  ) : !user.authUserIsFollowing ? (
                    <div className="mr-3 py-1 px-5 border rounded-full font-semibold">
                      Follow
                    </div>
                  ) : (
                    user.authUserIsFollowing === null && null
                  )}

                  <DotsHorizontalIcon className="h-5 w-5" />
                </div>
              </div>
              <div>{user.bio}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowersAndFollowing;
