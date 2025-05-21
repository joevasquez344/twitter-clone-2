import React, { useState } from "react";

import { getAllUsers } from "../utils/api/users";
import { useSelector } from "react-redux";

import useSearchUsersModal from "../hooks/useSearchUsersModal";
import SearchBar from "../components/SearchBar";
import SearchModal from "../components/SearchModal";

const UserSearchContainer = () => {
  const {
    modal,
    closeModal,
    openModal,
    handleSearchInput,
    searchInput,
    loadingUsers,
    searchResult,
  } = useSearchUsersModal();

  return (
    <>
      <div
        onClick={closeModal}
        className="fixed left-0 top-0 bottom-0 right-0 z-50"
      ></div>
      <div className="inline sm:hidden fixed top-16 left-0 right-0 bg-white z-50 mx-4">
        <SearchBar
          input={searchInput}
          inputChange={handleSearchInput}
          modal={openModal}
          openModal={openModal}
          closeModal={closeModal}
          loadingUsers={loadingUsers}
          mobile={true}
        />
        <div className="relative">
          <div className="text-xl font-bold">Home</div>{" "}
          {modal && (
            <SearchModal
              searchResult={searchResult}
              input={searchInput}
              mobile={true}
              closeModal={closeModal}
              loadingUsers={loadingUsers}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserSearchContainer;
