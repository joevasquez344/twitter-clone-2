import React from "react";

const MobileTweetButton = ({openModal}) => {
  return (
    <div
      onClick={openModal}
      className="fixed bottom-20 right-3 sm:hidden bg-blue-400 rounded-full flex items-center justify-center w-12 h-12 z-50"
    >
      <i className="fa-solid fa-plus text-white"></i>
    </div>
  );
};

export default MobileTweetButton;
