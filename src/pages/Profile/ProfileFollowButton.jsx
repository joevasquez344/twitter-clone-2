import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  followProfile,
  unfollowProfile,
} from "../../redux/profile/profile.actions";
import { followUser, unfollowUser } from "../../utils/api/users";
import { handleAuthLayout } from "../../utils/handlers";

const ProfileFollowButton = ({
  openModal,
  fetchProfile,
  isFollowing,
  setIsFollowing,
}) => {
  const authUser = useSelector((state) => state.users.user);
  const profile = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch()

  const handleFollowProfile = async () => {
    dispatch(followProfile(profile.id, authUser))
    // await followUser(profile.id, authUser.id) 
    // fetchProfile();
  };

  const handleUnfollowProfile = async () => {
    dispatch(unfollowProfile(profile.id, authUser))
    // await unfollowUser(profile.id, authUser.id)
    // fetchProfile();
  };

  useEffect(() => {
    handleAuthLayout(profile, setIsFollowing, authUser);

  }, [])

  const authUsersProfile = authUser.id === profile.id;
  const authIsFollowingProfile = isFollowing;

  return (
    <div>
      <div>
        {authUsersProfile ? (
          <button
            onClick={openModal}
            className="absolute right-5 mt-3 border rounded-full px-5 py-1 font-semibold"
          >
            Edit Profile
          </button>
        ) : (
          <div>
            {authIsFollowingProfile ? (
              <button
                onClick={handleUnfollowProfile}
                className="absolute right-5 mt-3 border rounded-full px-5 py-1 font-semibold"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollowProfile}
                className="absolute right-5 mt-3 border rounded-full px-5 py-1 font-semibold"
              >
                Follow
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFollowButton;
