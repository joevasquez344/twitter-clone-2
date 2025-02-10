import React from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import DefaultAvatar from "../components/DefaultAvatar";

const MobileHeader = () => {
  const user = useSelector((state) => state.users.user);

  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileRoute = () => navigate(`/${user.username}`);

  const isHomeScreen = location.pathname === "/home";
  const noAvatar = user.avatar === "" || user.avatar === null;
  return (
    <div
      className={`fixed ${
        isHomeScreen ? "flex" : "hidden"
      } items-center justify-center h-20 top-0 shadow-sm bg-white z-50 left-0 right-0 sm:hidden`}
    >
      <div className="absolute left-5">
        {noAvatar ? (
          <div onClick={handleProfileRoute}>
            <DefaultAvatar name={user.name} username={user.username} />
          </div>
        ) : (
          <img
            onClick={handleProfileRoute}
            src={user.avatar}
            alt="Profile Image"
            className={` object-cover h-7 w-7 rounded-full`}
          />
        )}
      </div>
      <img className=" h-7 w-7" src="https://links.papareact.com/drq" alt="" />
    </div>
  );
};

export default MobileHeader;
