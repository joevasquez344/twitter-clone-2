import React from "react";
import ArrowButton from "../../components/Buttons/ArrowButton";

const ProfileHeader = ({ profile, profilePostsCount }) => {
  return (
    <div className="z-40 sticky top-0 bg-white px-5 py-1 flex items-center">
      <div className="mr-8">
        <ArrowButton />
      </div>
      <div>
        <div className="text-base sm:text-xl font-bold">{profile.name}</div>
        <div className="text-sm text-gray-500 flex space-x-1">
          <div>{profilePostsCount}</div>{" "}
          {profilePostsCount === 1 ? <div>Tweet</div> : <div>Tweets</div>}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
