import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UsersIcon from "./Icons/UsersIcon";
import { useNavigate } from "react-router-dom";
import {
  followUser,
  getSuggestedUsers,
  hideSuggestions,
  showSuggestions,
  unfollowUser,
} from "../utils/api/users";
import DefaultAvatar from "./DefaultAvatar";
import XIcon from "./Icons/XIcon";
import AddIcon from "./Icons/AddIcon";
import { Tooltip } from "@material-tailwind/react";
import {
  HIDE_HOME_SUGGESTIONS,
  SHOW_HOME_SUGGESTIONS,
} from "../redux/users/users.types";

const ProfileSuggestions = () => {
  const [users, setUsers] = useState([]);
  const authUser = useSelector((state) => state.users.user);

  const [dropdown, setDropdown] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openDropdown = async () => {
    setDropdown(true);

    dispatch({ type: SHOW_HOME_SUGGESTIONS });

    await showSuggestions(authUser);
  };
  const closeDropdown = async () => {
    setDropdown(false);

    dispatch({ type: HIDE_HOME_SUGGESTIONS });

    await hideSuggestions(authUser);
  };

  const getUsers = async () => {
    const users = await getSuggestedUsers(authUser);
    setUsers(users);
  };

  const handleFollowSuggested = async (userToFollow) => {
    const match = userToFollow.followers.find(
      (follower) => follower.id === authUser.id
    );
    if (match) {
      const updatedSuggested = users.map((u) => {
        if (u.id === userToFollow.id) {
          u.followers = u.followers.filter(
            (follower) => follower.id !== authUser.id
          );
        }

        return u;
      });
      setUsers(updatedSuggested);

      await unfollowUser(userToFollow.id, authUser.id);
    } else {
      const updatedSuggested = users.map((u) => {
        if (u.id === userToFollow.id) {
          u.followers = [...u.followers, authUser];
        }

        return u;
      });
      setUsers(updatedSuggested);

      await followUser(userToFollow.id, authUser.id);
    }
  };

  const handleUserRoute = (username) => navigate(`/${username}`);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="border-b mt-20 sm:mt-0 border-t sm:border-t-0">
      <div className="flex items-center justify-between font-semibold px-5 py-2 sm:py-1">
        <div className="flex items-center">
          <div className="mr-3">
            <UsersIcon />
          </div>
          <div className="text-sm sm:text-base">Suggestions</div>
        </div>

        {dropdown && authUser.homeSuggestions === "open" ? (
          <Tooltip
            className="p-1 rounded-sm text-xs bg-gray-500"
            placement="bottom"
            content="Hide Suggestions"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 1 },
            }}
          >
            <div onClick={closeDropdown}>
              <XIcon />
            </div>
          </Tooltip>
        ) : (
          <Tooltip
            className="p-1 rounded-sm text-xs bg-gray-500"
            placement="bottom"
            content="View Suggestions"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 1 },
            }}
          >
            <div onClick={openDropdown}>
              <AddIcon />
            </div>
          </Tooltip>
        )}
      </div>
      <div>
        {dropdown && authUser.homeSuggestions === "open"
          ? users.map((user) => (
              <div
                className="flex px-4 py-3 hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200"
                key={user.id}
              >
                {user.avatar === null ? (
                  <div className="h-12 w-12 mr-3 flex items-center justify-center rounded-full bg-white z-50">
                    <DefaultAvatar name={user.name} username={user.username} />
                  </div>
                ) : (
                  <div className="h-14 w-14 mr-3 flex items-center justify-center rounded-full bg-white z-50">
                    <img
                      //   onClick={handleUserDetails}
                      className="h-12 w-12 rounded-full object-cover"
                      src={user.avatar}
                      alt=""
                    />
                  </div>
                )}

                <div className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <div
                      onClick={() => handleUserRoute(user.username)}
                      className="w-full"
                    >
                      <div className="font-bold">{user.name}</div>
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-1">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                    <>
                      <div className="">
                        {user.followers.find(
                          (follower) => follower.id === authUser.id
                        ) ? (
                          <div
                            className="bg-black flex items-center justify-center h-8 text-white text-sm font-bold rounded-full px-4"
                            onClick={() => handleFollowSuggested(user)}
                          >
                            Unfollow
                          </div>
                        ) : (
                          <div
                            className="bg-black flex items-center justify-center h-8 text-white text-sm font-bold rounded-full px-4"
                            onClick={() => handleFollowSuggested(user)}
                          >
                            Follow
                          </div>
                        )}
                      </div>
                    </>
                    {/* <div className="flex items-center relative">
                      <div
                      
                        className=" py-1 px-5 bg-black text-white rounded-full font-semibold"
                      >
                        Follow
                      </div>
                    </div> */}
                  </div>
                  <div onClick={() => handleUserRoute(user.username)}>
                    {user.bio}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default ProfileSuggestions;
