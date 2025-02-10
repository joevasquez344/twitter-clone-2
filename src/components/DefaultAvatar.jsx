import React from "react";
import { useNavigate } from "react-router-dom";

const DefaultAvatar = ({ name, username }) => {
  const navigate = useNavigate();
  
  const handleProfileRoute = () => navigate(`/${username}`);

  const firstNameInitial = name.split("")[0];

  return (
    <div
      onClick={handleProfileRoute}
      className={`h-12 w-12 flex items-center justify-center rounded-full object-cover bg-blue-400 text-white font-semibold sm:text-2xl`}
    >
      {firstNameInitial}
    </div>
  );
};

export default DefaultAvatar;
