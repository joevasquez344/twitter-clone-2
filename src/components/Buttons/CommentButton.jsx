import React, { useState } from "react";
import { ChatAlt2Icon } from "@heroicons/react/outline";
import { Tooltip } from "@material-tailwind/react";

const CommentButton = ({  handleOpenCommentModal, post }) => {

  return (
    <Tooltip
      className="hidden sm:flex p-1 rounded-sm text-xs bg-gray-500"
      placement="bottom"
      content="Reply"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 1 },
      }}
    >
        <div
          onClick={() => handleOpenCommentModal(post)}
          className="flex items-center group text-gray-400"
        >
          <div className="w-9 sm:mr-1 h-9 group-hover:bg-blue-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200">
            <ChatAlt2Icon
              fill={"transparent"}
              className="w-4 h-4 sm:h-5 sm:w-5 rounded-full group-hover:bg-blue-100 group-hover:text-blue-400 transition ease-in-out cursor-pointer duration-200"
            />
          </div>
          <p className="text-xs sm:text-sm group-hover:text-blue-400 transition ease-in-out cursor-pointer duration-200">
            {post.comments?.length === 0 ? null : post.comments?.length}
          </p>
        </div>
    </Tooltip>
  );
};

export default CommentButton;
