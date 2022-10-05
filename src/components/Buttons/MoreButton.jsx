import React, { useState } from "react";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { Tooltip } from "@material-tailwind/react";

const MoreButton = ({ openModal }) => {
  return (
    <Tooltip
      className="p-1 rounded-sm text-xs bg-gray-500"
      placement="bottom"
      content="More"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 1 },
      }}
    >
      <div
        onClick={openModal}
        className="w-9 h-9 flex group items-center justify-center rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
      >
        <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
      </div>
    </Tooltip>
  );
};

export default MoreButton;
