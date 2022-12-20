import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { name, username, location, createdAt, bio, following, followers } =
    useSelector((state) => state.profile.profile);

  const handleFollowersRoute = () => navigate(`/${username}/followers`);

  const handleFollowingRoute = () => navigate(`/${username}/following`);


  return (
    <div className="px-4 pb-2">
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
  );
};

export default ProfileInfo;
