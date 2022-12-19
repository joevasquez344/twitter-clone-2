import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { pinPost, unpinPost } from "../../utils/api/posts";
import { LocationMarkerIcon } from "@heroicons/react/outline";
import { unpinTweet, pinTweet } from "../../redux/users/users.actions";
const PinListItem = ({ post }) => {
  const authUser = useSelector((state) => state.users.user);
  const authsPinnedPost = useSelector((state) => state.users.authsPinnedPost);
  const authId = authUser.id;
  const postUserId = post.uid;

  const dispatch = useDispatch();

  const [pinnedPost, setPinnedPost] = useState(false);

  const handlePinPost = async () => {
    await pinPost(post.id, authId);
    dispatch(pinTweet(post, authId));
    setPinnedPost(true);
  };
  const handleUnpinPost = async () => {
    await unpinPost(post.id, authId);
    dispatch(unpinTweet(post, authId));
    setPinnedPost(false);
  };

  useEffect(() => {
    if (authsPinnedPost.id) setPinnedPost(true);
    else setPinnedPost(false);
  }, []);

  if (postUserId === authId) {
    return (
      <>
        {pinnedPost ? (
          <div
            className="flex items-center cursor-pointer p-4  hover:bg-gray-100"
            onClick={handleUnpinPost}
          >
            <LocationMarkerIcon className="w-5 h-5 mr-3" />{" "}
            <div>Unpin Post</div>
          </div>
        ) : (
          <div
            className="flex items-center cursor-pointer p-4  hover:bg-gray-100"
            onClick={handlePinPost}
          >
            <LocationMarkerIcon className="w-5 h-5 mr-3" /> <div>Pin Post</div>
          </div>
        )}
      </>
    );
  } else {
    return null;
  }
};

export default PinListItem;
