import React, { forwardRef } from "react";
import { DotsHorizontalIcon } from "@heroicons/react/outline";
import { Tooltip } from "@material-tailwind/react";

const MoreButton = forwardRef(({ openModal }, ref) => (
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
      ref={ref && ref}
      onClick={openModal}
      className="h-4 w-4 z-100 sm:w-9 sm:h-9 absolute right-0 -top-2 flex group items-center justify-center rounded-full hover:bg-blue-100 transition ease-in-out cursor-pointer duration-200"
    >
      <DotsHorizontalIcon className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition ease-in-out duration-200" />
    </div>
  </Tooltip>
));

export default MoreButton;
