import React from "react";
import DefaultAvatarLarge from "../../components/DefaultAvatarLarge";


const ProfileAvatar = ({ profile }) => {
  return (
    <div className="absolute bg-white -bottom-10  sm:-bottom-16 left-5 rounded-full p-1">
      {profile.avatar && profile.avatar !== null ? (
        <img
          className="h-16 w-16 sm:h-32 sm:w-32 object-cover rounded-full"
          src={profile.avatar}
          alt="Avatar"
        />
      ) : (
        <DefaultAvatarLarge
          name={profile.name}
          username={profile.username}
   
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
