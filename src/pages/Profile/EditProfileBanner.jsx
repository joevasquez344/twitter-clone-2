import React from "react";

const EditProfileBanner = ({ banner, bannerUrl, profile }) => {
  return (
    <div className="">
      <div>
        {banner ? (
          <div className="relative h-60 w-full">
            <div className="bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30 z-40 "></div>
            <img className="w-full object-cover h-60" src={bannerUrl} alt="" />
          </div>
        ) : (
          <div className="relative h-60 w-full">
            <div className="bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30 z-40"></div>
            {profile.banner && profile.banner !== null ? (
              <img
                className="w-full object-cover h-60"
                src={profile.banner}
                alt=""
              />
            ) : bannerUrl === null ? (
              <div className="bg-blue-500 h-60 w-full"></div>
            ) : (
              <div className="bg-blue-500 h-60 w-full"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfileBanner;
