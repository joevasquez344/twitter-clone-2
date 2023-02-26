import React from "react";

const ProfileBanner = ({ profile }) => {
  return (
    <div className="bg-gray-700">
      {" "}
      {profile.banner && profile.banner !== null ? (
        <img
          className="h-28 sm:h-52 object-contain w-full"
          src={profile.banner}
          alt="Avatar"
        />
      ) : (
        <div className="bg-blue-500 h-28 sm:h-52 w-full"></div>
      )}
    </div>
  );
};

export default ProfileBanner;
