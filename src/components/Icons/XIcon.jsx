import React from "react";

const XIcon = () => {
  return (
    <div className="w-5 h-5 sm:w-9 sm:h-9 flex justify-center items-center rounded-full sm:hover:bg-gray-100  transition ease-in-out cursor-pointer duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
  );
};

export default XIcon;
