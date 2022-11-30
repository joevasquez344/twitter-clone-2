import React from "react";
import {
  CollectionIcon,
  UserIcon,
  HomeIcon,
  BookmarkIcon,
  ColorSwatchIcon,
} from "@heroicons/react/outline";
import SidebarRow from "../components/SidebarRow";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/users/users.actions";

import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const user = useSelector((state) => state.users.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleHomeNavigation = () => navigate("/home");
  const handleProfileNavigation = () =>
    navigate(`/${user.username}`, { state: { userId: user.id } });
  const handleBookmarksNavigation = () => navigate("/bookmarks");
  const handleLogout = () => dispatch(logout());

  return (
    <div className="flex  flex-col items-center fixed md:items-start lg:items-start">
      <img
        className="m-3 h-10 w-10"
        src="https://links.papareact.com/drq"
        alt=""
      />
      <div onClick={handleHomeNavigation} className="w-full flex justify-center md:justify-start mt-2">
        <SidebarRow Icon={HomeIcon} title="Home" />
      </div>
      {/* <SidebarRow Icon={HashtagIcon} title="Explore" />
      <SidebarRow Icon={BellIcon} title="Notifications" />
      <SidebarRow Icon={MailIcon} title="Messages" /> */}
      <div className="w-full flex justify-center md:justify-start mt-2" onClick={handleBookmarksNavigation}>
        <SidebarRow Icon={BookmarkIcon} title="Bookmarks" />
      </div>

      {/* <SidebarRow Icon={CollectionIcon} title="Lists" /> */}
      <div className="w-full flex justify-center md:justify-start mt-2" onClick={handleProfileNavigation}>
        <SidebarRow Icon={UserIcon} title="Profile" />
      </div>
      <div className="w-full flex justify-center md:justify-start mt-2">
        <SidebarRow Icon={ColorSwatchIcon} title="Display" />
      </div>

      <div className="w-full flex justify-center md:justify-start mt-2" onClick={handleLogout}>
        <SidebarRow Icon={UserIcon} title="Sign Out" />
      </div>
      <div className="w-full flex justify-center md:justify-start mt-4" onClick={handleLogout}>
        <div className="bg-blue-400 text-white font-bold w-full text-center text-lg rounded-full py-3 cursor-pointer ">
          Tweet
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
