import React from "react";
import { useNavigate } from "react-router-dom";

const DefaultAvatar = ({
  name,
  username,
  height,
  width,
  textSize,
  mobileHeight,
  mobileWidth,
  mobileTextSize,
}) => {
  const navigate = useNavigate();
  const handleUserDetails = () => navigate(`/${username}`);

  const firstLetter = name.split("")[0];

  if (!height && !width) {
    height = "12";
    width = "12";
  }
  

  if(!mobileHeight && !mobileWidth) {
    mobileHeight = "12";
    mobileWidth = "12"
  }

  if (!textSize) {
    textSize = "2xl";
  }

  return (
    <div
      onClick={handleUserDetails}
      className={`h-${mobileHeight} w-${mobileWidth} sm:h-${height} sm:w-${width} flex items-center justify-center rounded-full object-cover bg-blue-400 text-white font-semibold text-${mobileTextSize} sm:text-${textSize}`}
    >
      {firstLetter}
    </div>
  );
};

export default DefaultAvatar;
