import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPosts,
  getUsersLikedPosts,
  getTweetsAndReplies,
  getMediaPosts,
} from "../../redux/profile/profile.actions";
import { Tooltip } from "@material-tailwind/react";


const RefreshBar = ({ activeTab }) => {
  const profile = useSelector((state) => state.profile.profile);
  const dispatch = useDispatch();

  const fetchPosts = () => {
    if (activeTab.text === "Tweets") {
      dispatch(getPosts(profile.username));
    } else if (activeTab.text === "Tweets & Replies") {
      dispatch(getTweetsAndReplies(profile.username));
    } else if (activeTab.text === "Media") {
      dispatch(getMediaPosts(profile.username));
    } else if (activeTab.text === "Likes") {
      dispatch(getUsersLikedPosts(profile.username));
    }
  };
  return (
    <Tooltip
      className="p-1 rounded-sm text-xs bg-gray-500"
      placement="bottom"
      content={`Refresh ${activeTab.text}`}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 1 },
      }}
    >
      <div
        onClick={fetchPosts}
        className="border-b w-full px-6 flex justify-center items-center h-10 hover:bg-blue-50 transition ease-in-out cursor-pointer duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-blue-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
    </Tooltip>
  );
};

export default RefreshBar;
