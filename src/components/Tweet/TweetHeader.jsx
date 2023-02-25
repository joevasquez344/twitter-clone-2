import React from "react";
import LastSeen from "../LastSeen";

const TweetHeader = ({ name, username, timestamp, isPinned }) => {
  return (
    <div className=" flex justify-between items-center">
      <div
        //   ref={topRef}
        className={`flex items-center ${isPinned && "mt-1"}`}
      >
        <div className="font-semibold mr-1">{name}</div>
        <div className="text-gray-500 text-sm sm:text-base mr-1.5">
          @{username}
        </div>
        <div className="h-0.5 w-0.5 rounded-full bg-gray-500 mr-1.5"></div>
        <div className="text-gray-500 text-sm sm:text-base">
          <LastSeen date={new Date(timestamp.seconds * 1000)} />
        </div>
      </div>
    </div>
  );
};

export default TweetHeader;
