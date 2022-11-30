import React from "react";
import { useNavigate } from "react-router-dom";

const DefaultAvatar = ({ name, username, height, width, textSize }) => {
  const navigate = useNavigate();
  const handleUserDetails = () => navigate(`/${username}`);

  const firstLetter = name.split("")[0];

  if (!height || !width) {
    height = "12";
    width = "12";
  }

  if (!textSize) {
    textSize = "2xl";
  }
  return (
    <div
      onClick={handleUserDetails}
      className={`h-${height} w-${width} flex items-center justify-center rounded-full object-cover bg-blue-400 text-white font-semibold text-${textSize}`}
    >
      {firstLetter}
    </div>
  );
};

export default DefaultAvatar;
