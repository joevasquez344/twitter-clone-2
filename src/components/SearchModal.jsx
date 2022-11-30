import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "./DefaultAvatar";
import { UserIcon } from "@heroicons/react/solid";

const SearchModal = ({ input, searchedUsers }) => {
  const navigate = useNavigate();
  return (
    <div className="">
      {input.length === 0 || searchedUsers.length === 0 ? (
        <div className="z-50 flex justify-center pt-3 pb-12 bg-white shadow-lg absolute left-0 top-0 w-full text-gray-500">
          Try searching for people
        </div>
      ) : (
        <div className="z-50 bg-white shadow-lg absolute left-0 top-0 w-full ">
          {searchedUsers.map((user) => (
            <div
              onClick={() => navigate(`/${user.username}`)}
              className="flex p-3 hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200"
              key={user.id}
            >
              {user.avatar === null ? (
                <div className="mr-2">
                  <DefaultAvatar name={user.name} username={user.username} />
                </div>
              ) : (
                <div>
                  <img
                    className="h-12 w-12 rounded-full object-cover mr-4"
                    src={user.avatar}
                    alt=""
                  />
                </div>
              )}

              <div className="w-full ml-2">
                <div className="flex items-center justify-between w-full">
                  <div className="w-full">
                    <div className="font-bold">{user.name}</div>

                    <div className="text-gray-500 mr-1 text-sm">@{user.username}</div>
                    {user.display !== null ? (
                      <div className="flex items-center text-gray-500 text-sm">
                        <UserIcon className="w-4 h-4 mr-1" />
                        {user.display}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">{user.bio}</div>
                    )}
                  </div>
                  <div className="flex items-center relative"></div>
                </div>
              </div>
            </div>
          ))}{" "}
        </div>
      )}
    </div>
  );
};

export default SearchModal;
