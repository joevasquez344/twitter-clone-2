import React from "react";
import { Tooltip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const TweetReplyTo = ({
  postType,
  replyToUsers,
  handleReplyToUsernames,
  post,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center">
      {postType === "comment" ? (
        <div className="z-100 mr-1 text-gray-500 text-sm sm:text-base">
          Replying to{" "}
        </div>
      ) : null}
      <div className="flex items-center">
        {" "}
        {replyToUsers?.length === 0 && postType === "comment" ? (
          <Tooltip
            className="p-1 text-xs bg-gray-500 rounded-sm"
            placement="bottom"
            content="Unknown user"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 1 },
            }}
          >
            <div className="z-100 text-blue-500 cursor-text">user</div>
          </Tooltip>
        ) : null}
        {handleReplyToUsernames(replyToUsers, post).map((username) => (
          <div className="tweet__userWhoReplied z-100 flex items-center text-blue-500 bg-white">
            <div
              onClick={() => navigate(`/${username}`)}
              className="mr-1 text-sm sm:text-base sm:hover:underline"
              key={username}
            >
              @{username}
            </div>{" "}
            <div className="mr-1 username text-sm sm:text-base">and</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TweetReplyTo;
