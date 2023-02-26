import React from "react";

const ProfileTabs = ({ tabs, handleTabs }) => {
  return (
    <div className="items-center flex justify-evenly grid-cols-4">
      {tabs?.map((tab) => (
        <div
          key={tab.id}
          onClick={() => handleTabs(tab.id)}
          className={`w-full relative h-14 flex justify-center  border-b ${
            tab.isActive ? "text-black-500" : "text-gray-500"
          } font-semibold py-4 sm:hover:bg-gray-200 transition ease-in-out cursor-pointer duration-200 `}
        >
          <div
            className={` flex ${
              tab.isActive ? "border-b-4 border-blue-500" : ""
            } items-center justify-center absolute top-0 inline-block whitespace-nowrap overflow-ellipsis text-sm sm:text-base bottom-0 h-full`}
          >
            {tab.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileTabs;
