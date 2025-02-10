import React from "react";
import { useNavigate } from "react-router-dom";

const DefaultAvatarLarge = ({ username, name }) => {
  const navigate = useNavigate();

  const handleUserDetails = () => navigate(`/${username}`);

  const firstNameInitial = name.split("")[0];

  return (
    <div
      onClick={handleUserDetails}
      className={`h-16 w-16 sm:h-32 sm:w-32 flex items-center justify-center rounded-full object-cover bg-blue-400 text-white font-semibold text-2xl sm:text-4xl`}
    >
      {firstNameInitial}
    </div>
  );
};

export default DefaultAvatarLarge;
