import React from "react";

const EditProfileBanner = ({ banner, bannerUrl }) => {
  return (
    <div className="">
      <div>
        {banner ? (
          <div className="relative bg-gray-700 h-60 w-full">
            <div className="bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30 z-40 "></div>
            <img className="w-full object-contain h-60" src={bannerUrl} alt="" />
          </div>
        ) : (
          <div className="relative h-60 bg-gray-700 w-full">
            <div className="bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30 z-40"></div>
            {bannerUrl !== null ? (
              <img
                className="w-full object-contain h-60"
                src={bannerUrl}
                alt="Profile Banner"
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
