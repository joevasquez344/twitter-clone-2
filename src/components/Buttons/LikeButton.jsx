import React, { useState } from "react";
import { HeartIcon } from "@heroicons/react/outline";
import { Tooltip } from "@material-tailwind/react";

const LikeButton = ({ isLiked, likes, handleLikePost, post }) => {

  return (
    <Tooltip className="p-1 rounded-sm text-xs bg-gray-500" placement="bottom"  content={isLiked ? "Unlike" : "Like"}
    animate={{
      mount: { scale: 1, y: 0 },
      unmount: { scale: 0, y: 1 },
      
    }}>
      <div className="relative">
        <div
    
          onClick={() => handleLikePost(post.id)}
          className={`flex items-center space-x-3 cursor-pointer text-${
            isLiked ? "red" : "gray"
          }-400`}
        >
          <div className="flex items-center group">
            <div className="w-9 mr-1 h-9 group-hover:bg-red-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200">
              <HeartIcon
                fill={isLiked ? "red" : "transparent"}
                className="h-5 w-5 rounded-full group-hover:bg-red-100 group-hover:text-red-500 transition ease-in-out cursor-pointer duration-200"
              />
            </div>
            <p className="text-sm group-hover:text-red-500 transition ease-in-out cursor-pointer duration-200">
              {likes?.length === 0 ? "" : likes?.length}
            </p>
          </div>
        </div>
      
      </div>
    </Tooltip>
  );
};

export default LikeButton;
