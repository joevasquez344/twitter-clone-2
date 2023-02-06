import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LocationIcon from "../../components/Icons/LocationIcon";
import CalendarIcon from "../../components/Icons/CalendarIcon";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { name, username, location, createdAt, bio, following, followers } =
    useSelector((state) => state.profile.profile);

  const handleFollowersRoute = () => navigate(`/${username}/followers`);

  const handleFollowingRoute = () => navigate(`/${username}/following`);

  return (
    <div className="px-4 pb-2">
      <div className="font-bold text-lg sm:text-lg">{name}</div>
      <div className="mb-2 text-sm sm:text-base text-slate-500">@{username}</div>
      <div className="mb-2 text-sm sm:text-base">{bio}</div>
      <div className="flex items-center mb-2 text-slate-500">
        <div className="mr-1">
          <LocationIcon />
        </div>
        <div className="mr-3 text-xs sm:text-base">{location}</div>
        <div className="mr-1">
          <CalendarIcon />
        </div>
        <div className="text-xs sm:text-base">{createdAt}</div>
      </div>
      <div className="flex items-center mb-2">
        <div
          onClick={handleFollowingRoute}
          className="flex items-center text-sm mr-4 cursor-pointer hover:underline"
        >
          <div className="font-semibold mr-1">{following?.length}</div>
          <div className="text-slate-500 text-xs sm:text-sm">Following</div>
        </div>
        <div
          onClick={handleFollowersRoute}
          className="flex items-center text-sm cursor-pointer hover:underline"
        >
          <div className="font-semibold mr-1">{followers?.length}</div>
          <div className="text-slate-500 text-xs sm:text-sm">Followers</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
