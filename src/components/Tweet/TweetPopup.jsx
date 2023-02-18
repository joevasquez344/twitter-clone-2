import React from "react";
import {useSelector} from 'react-redux';
import {
    LocationMarkerIcon,
    TrashIcon,
    UserAddIcon,
    UserRemoveIcon,
  } from "@heroicons/react/outline";
import MoreButton from "../Buttons/MoreButton";

const TweetPopup = ({openModal, modal, closeModal, uid, deletePost, followUser, postUsername, authIsFollowing, authUsersPost, authsPinnedPost, post, unpinPost, pinPost}) => {
  const user = useSelector(state => state.users.user)
    return (
    <>
     
      {modal ? (
        <div
          onClick={closeModal}
          className="bg-transparent cursor-default fixed top-0 bottom-0 left-0 right-0 opacity-40 w-screen h-screen z-50"
        ></div>
      ) : null}
      <div
        className={`${
          modal
            ? "flex flex-col w-3/5 absolute right-0 top-0 bg-white shadow-xl z-50 font-bold"
            : "hidden"
        }`}
      >
        <div>
          {user.id === uid ? (
            <div
              onClick={deletePost}
              className="flex items-center text-red-400 p-3 hover:bg-gray-100"
            >
              {" "}
              <TrashIcon className="h-5 w-5 mr-3" /> Delete
            </div>
          ) : (
            <>
              {authIsFollowing ? (
                <div
                  onClick={followUser}
                  className=" flex items-center p-3 hover:bg-gray-100"
                >
                  <UserRemoveIcon className="h-5 w-5 mr-3" /> Unfollow @
                  {postUsername}
                </div>
              ) : (
                <div
                  onClick={followUser}
                  className=" flex items-center p-3 hover:bg-gray-100"
                >
                  <UserAddIcon className="h-5 w-5 mr-3" /> Follow @{postUsername}
                </div>
              )}
            </>
          )}
        </div>
        <div>
          {authUsersPost && (
            <div>
              {authsPinnedPost?.id === post.id ? (
                <div
                  onClick={unpinPost}
                  className="flex items-center p-3 hover:bg-gray-100"
                >
                  <LocationMarkerIcon className="h-5 w-5 mr-3" /> Unpin from
                  profile
                </div>
              ) : (
                <div
                  onClick={pinPost}
                  className="flex items-center p-3 hover:bg-gray-100"
                >
                  <LocationMarkerIcon className="h-5 w-5 mr-3" /> Pin to your
                  profile
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TweetPopup;
