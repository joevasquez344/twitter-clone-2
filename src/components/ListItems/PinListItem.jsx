import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { pinPost, unpinPost } from "../../utils/api/posts";
import { LocationMarkerIcon } from "@heroicons/react/outline";
const PinListItem = ({ post }) => {
  const authUser = useSelector((state) => state.users.user);
  const authId = authUser.id;
  const postUserId = post.uid;

  const [pinnedPost, setPinnedPost] = useState(false);

  const handlePinPost = async () => {
    await pinPost(post.id, authId);
    setPinnedPost(true);
  };
  const handleUnpinPost = async () => {
    await unpinPost(post.id, authId);
    setPinnedPost(false);
  };

  useEffect(() => {
    if (post.pinnedPost === true) setPinnedPost(true);
    else setPinnedPost(false);
  }, []);

  if (postUserId === authId) {
    return (
      <>
        {pinnedPost ? ( 
          <div className="flex items-center cursor-pointer p-3  hover:bg-gray-100" onClick={handleUnpinPost}>
            <LocationMarkerIcon className='w-5 h-5 mr-3' /> <div>Unpin Post</div>
          </div>
        ) : (
          <div className="flex items-center cursor-pointer p-3  hover:bg-gray-100" onClick={handlePinPost}>
            <LocationMarkerIcon className='w-5 h-5 mr-3' /> <div>Pin Post</div>
          </div>
        )}
      </>
    );
  } else {
    return null;
  }
};

export default PinListItem;
