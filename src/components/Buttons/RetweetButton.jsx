import React, { forwardRef } from "react";
import { SwitchHorizontalIcon } from "@heroicons/react/outline";
import { Tooltip } from "@material-tailwind/react";

const RetweetButton = forwardRef((props, ref) => (
  <Tooltip
    className=" p-1 rounded-sm text-xs bg-gray-500"
    placement="bottom"
    content="Retweet feature coming soon"
    animate={{
      mount: { scale: 1, y: 0 },
      unmount: { scale: 0, y: 1 },
    }}
  >
    <div className="flex items-center group text-gray-400" ref={ref}>
      <div className="w-9 mr-1 h-9 sm:group-hover:bg-green-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200">
        <SwitchHorizontalIcon
          fill={"transparent"}
          className="h-4 w-4 sm:h-5 sm:w-5 rounded-full sm:group-hover:bg-green-100 sm:group-hover:text-green-400 transition ease-in-out cursor-pointer duration-200"
        />
      </div>
    </div>
  </Tooltip>
));

export default RetweetButton;
