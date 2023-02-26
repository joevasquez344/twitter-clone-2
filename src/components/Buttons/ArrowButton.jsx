import React from "react";
import { Tooltip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const ArrowButton = ({ route }) => {
  const navigate = useNavigate();

  const handleRoute = () => {
    if (route) {
      route();
    } else {
      navigate(-1);
    }
  };
  return (
    <>
      <Tooltip
        className="hidden sm:flex p-1 z-50 rounded-sm text-xs bg-gray-500"
        placement="bottom"
        content="Back"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0, y: 1 },
        }}
      >
        <div
          onClick={handleRoute}
          className="w-9 h-9 flex group items-center justify-center rounded-full sm:hover:bg-gray-200 transition ease-in-out cursor-pointer duration-200"
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </div>
      </Tooltip>
    </>
  );
};

export default ArrowButton;
