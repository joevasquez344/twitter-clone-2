import React from "react";
import DefaultAvatar from "../../components/DefaultAvatar";

const EditProfileAvatar = ({ avatar, avatarUrl, profile }) => {
  return (
    <div>
      {" "}
      {avatar ? (
        <img
          className="rounded-full object-cover h-32 w-32"
          src={avatarUrl}
          alt="Avatar"
        />
      ) : (
        <>
          {profile.avatar && profile.avatar !== null ? (
            <div>
              <div className="bg-black rounded-full absolute top-1 bottom-1 left-1 right-1 opacity-40 z-30 "></div>

              <img
                className="h-32 w-32 object-cover rounded-full"
                src={profile.avatar}
                alt="Avatar"
              />
            </div>
          ) : (
            <DefaultAvatar
              name={profile.name}
              username={profile.username}
              height="32"
              width="32"
            />
          )}
        </>
      )}
    </div>
  );
};

export default EditProfileAvatar;
