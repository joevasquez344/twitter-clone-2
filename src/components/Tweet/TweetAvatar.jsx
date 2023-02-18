import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "../DefaultAvatar";

const TweetAvatar = ({ avatar, name, username, threadPost, isPinned }) => {
  const navigate = useNavigate();
  const handleUserDetails = () => navigate(`/${username}`);
  return (
    <div className=" relative">
      {avatar === null || avatar === "" ? (
        <div className="relative h-full">
          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center z-100">
            <div className="h-16 w-16 rounded-full flex justify-center items-center">
              <DefaultAvatar name={name} username={username} />
            </div>
          </div>
          {threadPost && (
            <hr className="absolute left-1/2 h-full border border-gray" />
          )}
        </div>
      ) : (
        <div className="relative h-full">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-100">
            <div className="h-16 w-16 rounded-full flex justify-center items-center">
              <img
                onClick={handleUserDetails}
                src={avatar}
                alt="Profile Image"
                className={` ${isPinned && "my-1"} ${
                  threadPost && " my-2"
                } object-cover h-12 w-12 rounded-full`}
              />
            </div>
          </div>

          {threadPost && (
            <hr className="absolute left-1/2 h-full border border-gray" />
          )}
        </div>
      )}
    </div>
  );
};

export default TweetAvatar;
