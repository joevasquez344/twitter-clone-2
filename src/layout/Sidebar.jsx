import React, { useState } from "react";
import {
  CollectionIcon,
  UserIcon,
  HomeIcon,
  BookmarkIcon,
  ColorSwatchIcon,
  HashtagIcon,
  SearchIcon,
} from "@heroicons/react/outline";

import SidebarRow from "../components/SidebarRow";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/users/users.actions";

import { useNavigate, useLocation } from "react-router-dom";
import TweetModal from "../components/TweetModal";
import LogoutIcon from "../components/Icons/LogoutIcon";
import { getAllUsers, getProfileFollowing } from "../utils/api/users";
import SearchBar from "../components/SearchBar";
import SearchModal from "../components/SearchModal";
const Sidebar = () => {
  const user = useSelector((state) => state.users.user);

  const [tweetModal, setTweetModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchModal, setSearchModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const fetchAllUsers = async () => {
    const users = await getAllUsers();

    return users;
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    const searchResults = allUsers.filter(
      (user) =>
        user.username.toLowerCase().match(e.target.value.toLowerCase()) ||
        user.username.toUpperCase().match(e.target.value.toUpperCase()) ||
        user.name.toUpperCase().match(e.target.value.toUpperCase()) ||
        user.name.toUpperCase().match(e.target.value.toUpperCase())
    );

    setSearchedUsers(searchResults);
  };

  const handleOpenSearchModal = async () => {
    setSearchModal(true);
    setSearchInput("");

    let users = await fetchAllUsers();
    console.log("users: ", users);
    let authFollowing = await getProfileFollowing(user.id);

    users = users.map((user) => {
      const authFollowsListUser = authFollowing.find(
        (profile) => profile.id === user.id
      );

      const listUserFollowsAuth = user.following.find(
        (profile) => profile.id === user.id
      );

      if (listUserFollowsAuth && authFollowsListUser) {
        user.display = "You follow each other";
      } else if (listUserFollowsAuth && !authFollowsListUser) {
        user.display = "Follows you";
      } else if (authFollowsListUser && !listUserFollowsAuth) {
        user.display = "Following";
      } else {
        user.display = null;
      }

      return user;
    });

    setAllUsers(users);
  };
  const handleCloseSearchModal = () => {
    setSearchModal(false);
  };

  const handleOpenTweetModal = () => setTweetModal(true);

  const handleCloseTweetModal = () => setTweetModal(false);

  const handleHomeNavigation = () => navigate("/home");
  const handleExploreNavigation = () => navigate("/explore");
  const handleProfileNavigation = () =>
    navigate(`/${user.username}`, { state: { userId: user.id } });
  const handleBookmarksNavigation = () => navigate("/bookmarks");
  const handleLogout = () => dispatch(logout());
  console.log("Params", location);

  return (
    <>
      <div className="flex flex-col ml-4 md:ml-0 fixed md:items-start ">
        <img
          className="mt-6 mx-auto md:mx-0 md:ml-4 h-8 w-8"
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

        <div
          onClick={handleOpenSearchModal}
          className="w-full flex justify-center md:justify-start mt-2"
        >
          <SidebarRow Icon={SearchIcon} title="Search" />
        </div>
        <div
          onClick={handleExploreNavigation}
          className="w-full flex justify-center md:justify-start mt-2"
        >
          <SidebarRow bold={location.pathname === "/explore" ? true : false} Icon={SearchIcon} title="Explore" />
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
          <div className="hidden md:flex items-center justify-center bg-blue-400 text-white font-bold w-full text-center text-lg rounded-full py-3 cursor-pointer">
            Tweet
          </div>
          <div
            onClick={handleOpenTweetModal}
            className=" bg-blue-400 rounded-full flex md:hidden items-center justify-center w-12 h-12"
          >
            <i className="fa-solid fa-plus text-white"></i>
          </div>
        </div>
      </div>
      {tweetModal && <TweetModal closeModal={handleCloseTweetModal} />}
      {searchModal && (
        <>
          <div
            onClick={() => setSearchModal(false)}
            className="fixed left-0 opacity-40 bg-black top-0 bottom-0 right-0 z-50"
          ></div>
          <div className="inline fixed top-16 left-0 right-0 bg-white z-50 mx-4 sm:fixed sm:top-30 sm:w-1/3 sm:left-1/3">
            <SearchBar
              input={searchInput}
              inputChange={handleSearchInput}
              searchModal={searchModal}
              openModal={handleOpenSearchModal}
              closeModal={handleCloseSearchModal}
              loadingUsers={loadingUsers}
              mobile={true}
            />
            <div className="relative">
              {searchModal && (
                <SearchModal
                  searchedUsers={searchedUsers}
                  input={searchInput}
                  mobile={true}
                  closeModal={handleCloseSearchModal}
                  loadingUsers={loadingUsers}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
