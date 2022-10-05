import React from "react";
import { useNavigate } from "react-router-dom";

const DefaultAvatar = ({ name, username }) => {
  const navigate = useNavigate();
  const handleUserDetails = () => navigate(`/${username}`);

  const firstLetter = name.split("")[0];
  return (
  
      <div onClick={handleUserDetails} className="h-12 w-12 flex items-center justify-center rounded-full object-cover bg-blue-400 text-white font-semibold text-2xl">
      {firstLetter}
    </div>

  );
};

export default DefaultAvatar;
