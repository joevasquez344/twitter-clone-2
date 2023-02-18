import React, { useState } from "react";
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

import { useNavigate, useLocation } from "react-router-dom";
import TweetModal from "../components/TweetModal";
import LogoutIcon from "../components/Icons/LogoutIcon";
const Sidebar = () => {
  const user = useSelector((state) => state.users.user);

  const [tweetModal, setTweetModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleOpenTweetModal = () => setTweetModal(true);

  const handleCloseTweetModal = () => setTweetModal(false);

  const handleHomeNavigation = () => navigate("/home");
  const handleProfileNavigation = () =>
    navigate(`/${user.username}`, { state: { userId: user.id } });
  const handleBookmarksNavigation = () => navigate("/bookmarks");
  const handleLogout = () => dispatch(logout());
  console.log("Params", location);

  return (
    <>
      <div className="flex  flex-col items-center fixed md:items-start lg:items-start">
        <img
          className="mt-6 ml-4 h-8 w-8"
          src="https://links.papareact.com/drq"
          alt=""
        />
        <div
          onClick={handleHomeNavigation}
          className="w-full flex justify-center md:justify-start mt-2"
        >
          <SidebarRow
            bold={location.pathname === "/home" ? true : false}
            Icon={HomeIcon}
            title="Home"
          />
        </div>
        {/* <SidebarRow Icon={HashtagIcon} title="Explore" />
      <SidebarRow Icon={BellIcon} title="Notifications" />
      <SidebarRow Icon={MailIcon} title="Messages" /> */}
        <div
          className="w-full flex justify-center md:justify-start mt-2"
          onClick={handleBookmarksNavigation}
        >
          <SidebarRow
            bold={location.pathname === "/bookmarks" ? true : false}
            Icon={BookmarkIcon}
            title="Bookmarks"
          />
        </div>

        {/* <SidebarRow Icon={CollectionIcon} title="Lists" /> */}
        <div
          className="w-full flex justify-center md:justify-start mt-2"
          onClick={handleProfileNavigation}
        >
          <SidebarRow
            bold={location.pathname === `/${user.username}` ? true : false}
            Icon={
              location.pathname === `/${user.username}` ? UserIcon : UserIcon
            }
            title="Profile"
          />
        </div>

        <div
          className="w-full flex justify-center md:justify-start mt-2"
          onClick={handleLogout}
        >
          <SidebarRow Icon={LogoutIcon} title="Sign Out" />
        </div>
        <div
          className="w-full flex justify-center md:justify-start mt-4"
          onClick={handleOpenTweetModal}
        >
          <div className="bg-blue-400 text-white font-bold w-full text-center text-lg rounded-full py-3 cursor-pointer ">
            Tweet
          </div>
        </div>
      </div>
      {tweetModal && <TweetModal closeModal={handleCloseTweetModal} />}
    </>
  );
};

export default Sidebar;
