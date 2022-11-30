import React from "react";
import DefaultAvatar from "../../components/DefaultAvatar";

const ProfileAvatar = ({ profile }) => {
  return (
    <div className="absolute bg-white  -bottom-16 left-5 rounded-full p-1">
      {profile.avatar && profile.avatar !== null ? (
        <img
          className="h-32 w-32 object-cover rounded-full"
          src={profile.avatar}
          alt="Avatar"
        />
      ) : (
        <DefaultAvatar
          name={profile.name}
          username={profile.username}
          height="32"
          width="32"
          textSize="4xl"
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
