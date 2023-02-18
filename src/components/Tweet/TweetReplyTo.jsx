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
        <div className="mr-1 text-gray-500 text-sm sm:text-base z-100">
          Replying to{" "}
        </div>
      ) : null}
      <div className="flex items-center">
        {" "}
        {replyToUsers?.length === 0 && postType === "comment" ? (
          <Tooltip
            className="p-1 rounded-sm text-xs bg-gray-500"
            placement="bottom"
            content="Unknown user"
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 1 },
            }}
          >
            <div className="text-blue-500 cursor-text z-100">user</div>
          </Tooltip>
        ) : null}
        {handleReplyToUsernames(replyToUsers, post).map((username) => (
          <div className="tweet__userWhoReplied flex items-center text-blue-500 z-100 bg-white">
            <div
              onClick={() => navigate(`/${username}`)}
              className="mr-1 hover:underline"
              key={username}
            >
              @{username}
            </div>{" "}
            <div className="username mr-1">and</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TweetReplyTo;
