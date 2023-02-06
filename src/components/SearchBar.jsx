import React, { useState } from "react";
import { SearchIcon } from "@heroicons/react/outline";

const SearchBar = ({ searchModal, openModal, closeModal, input, inputChange }) => {
  return (
    <>
      {searchModal && (
        <div
          onClick={closeModal}
          className="fixed left-0 top-0 w-screen h-screen z-40"
        ></div> 
      )}
      <div className="relative z-50">
        <div className="flex items-center mt-6 mb-3 p-2 space-x-2 bg-gray-100 sm:p-3 rounded-full sm:my-3">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            onClick={openModal}
            className="text-sm sm:text-base bg-transparent flex-1 outline-none"
            type="text"
            placeholder="Search Profiles"
            value={input}
            onChange={inputChange}
          />
         
        </div>
      </div>
    </>
  );
};

export default SearchBar;
