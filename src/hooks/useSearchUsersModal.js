import React, { useState } from "react";
import { getAllUsers, getProfileFollowing } from "../utils/api/users";
import { useSelector } from "react-redux";

const useSearchUsersModal = () => {
  const user = useSelector((state) => state.users.user);

  const [modal, setModal] = useState(false);

  const [loadingUsers, setLoadingUsers] = useState(true);

  const [searchInput, setSearchInput] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [searchResult, setSearchResult] = [];

  const fetchAllUsers = async () => {
    const users = await getAllUsers();
    setLoadingUsers(false);

    return users;
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    const searchResults = allUsers.filter(
      (payload) =>
        payload.user.username
          .toLowerCase()
          .match(e.target.value.toLowerCase()) ||
        payload.user.username
          .toUpperCase()
          .match(e.target.value.toUpperCase()) ||
        payload.user.name.toUpperCase().match(e.target.value.toUpperCase()) ||
        payload.user.name.toUpperCase().match(e.target.value.toUpperCase())
    );

    setSearchResult(searchResults);
  };

  const openModal = async () => {
    setModal(true);
    setSearchInput("");

    // Eventually, fetch users based off of Auth's interests, connections, location, popular twitter users, etc.
    let allTwitterUsers = await fetchAllUsers();

    let authsFollowingList = await getProfileFollowing(user.id);

    allTwitterUsers = allTwitterUsers.map((user) => {
      let payload = {
        user,
        display: null,
      };

      const authFollowsProfile = authsFollowingList.find(
        (profile) => profile.id === user.id
      );

      const profileFollowsAuth = user.following.find(
        (profile) => profile.id === user.id
      );

      if (profileFollowsAuth && authFollowsProfile) {
        payload.display = "You follow each other";
      } else if (profileFollowsAuth && !authFollowsProfile) {
        payload.display = "Follows you";
      } else if (authFollowsProfile && !profileFollowsAuth) {
        payload.display = "Following";
      } else {
        payload.display = null;
      }

      return payload;
    });

    setAllUsers(allTwitterUsers);
  };
  const closeModal = () => {
    setModal(false);
  };
  return {
    modal,
    closeModal,
    openModal,
    handleSearchInput,
    searchInput,
    loadingUsers,
    searchResult,
  };
};

export default useSearchUsersModal;
