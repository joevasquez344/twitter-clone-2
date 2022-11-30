import React from "react";
import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import { Tooltip } from "@material-tailwind/react";

const RetweetButton = () => {

  return (
    <Tooltip
      className="p-1 rounded-sm text-xs bg-gray-500"
      placement="bottom"
      content="Retweet feature coming soon"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 1 },
      }}
    >
        <div
          className="flex items-center group text-gray-400"
        >
          <div className="w-9 mr-1 h-9 group-hover:bg-green-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200">
            <SwitchHorizontalIcon
              fill={"transparent"}
              className="h-5 w-5 rounded-full group-hover:bg-green-100 group-hover:text-green-400 transition ease-in-out cursor-pointer duration-200"
            />
          </div>

        </div>
    </Tooltip>
  );
};

export default RetweetButton;
