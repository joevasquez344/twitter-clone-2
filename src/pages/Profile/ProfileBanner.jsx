import React from "react";

const ProfileBanner = ({ profile }) => {
  return (
    <div>
      {" "}
      {profile.banner && profile.banner !== null ? (
        <img
          className="h-60 object-cover w-full"
          src={profile.banner}
          alt="Avatar"
        />
      ) : (
        <div className="bg-blue-500 h-60 w-full"></div>
      )}
    </div>
  );
};

export default ProfileBanner;
