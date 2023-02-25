import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DefaultAvatar from "../../components/DefaultAvatar";

const LikedBy = ({ postLikes, handleFollowLikedUser }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  return (
    <>
      {" "}
      {postLikes.map((like) => (
        <div className="hover:bg-gray-50 transition ease-in-out cursor-pointer duration-200 py-2 px-4 z-100">
          <div className="flex">
            {like.avatar === null || like.avatar === "" ? (
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white">
                <DefaultAvatar name={like.name} username={like.username} />
              </div>
            ) : (
              <div className="h-16 w-16 flex items-center justify-center  rounded-full bg-white">
                <img
                  onClick={() => navigate(`/${like.username}`)}
                  className="h-12 w-12 rounded-full object-cover"
                  src={like.avatar}
                  alt=""
                />
              </div>
            )}
            <div className="items-center mb-2 w-full">
              <div className="flex justify-between items-center">
                <div
                  onClick={() => navigate(`/${like.username}`)}
                  className="w-full"
                >
                  <div className="font-bold">{like.name}</div>
                  <div className="text-gray-500 mb-1">@{like.username}</div>
                </div>
                <>
                  {user.id === like.id ? (
                    ""
                  ) : (
                    <div className="">
                      {like.followers.find(
                        (follower) => follower.id === user.id
                      ) ? (
                        <div
                          className="bg-black flex items-center justify-center h-8 text-white text-sm font-bold rounded-full px-4"
                          onClick={() => handleFollowLikedUser(like)}
                        >
                          Unfollow
                        </div>
                      ) : (
                        <div
                          className="bg-black flex items-center justify-center h-8 text-white text-sm font-bold rounded-full px-4"
                          onClick={() => handleFollowLikedUser(like)}
                        >
                          Follow
                        </div>
                      )}
                    </div>
                  )}
                </>
              </div>
              <div onClick={() => navigate(`/${like.username}`)}>
                {user.id === like.uid ? "" : like.bio}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LikedBy;
