import React, { forwardRef } from "react";
import { Tooltip } from "@material-tailwind/react";

const BookmarkButton = forwardRef(
  (
    { handleAddBookmark, handleRemoveBookmark, bookmarks, post, enlarged },
    ref
  ) => {
    const isBookmarked = bookmarks.find((bookmarkId) => bookmarkId === post.id);

    if (isBookmarked) {
      return (
        <Tooltip
          className="hidden sm:flex p-1 rounded-sm text-xs bg-gray-500"
          placement="bottom"
          content="Remove Bookmark"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 1 },
          }}
        >
          <div
            onClick={handleRemoveBookmark}
            className="flex items-center group text-gray-400 bookmark__button"
            ref={ref}
          >
            <div className="w-9 h-9 sm:group-hover:bg-blue-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="dodgerblue"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${
                  enlarged ? "w-5 h-5 sm:w-7 sm:h-7" : "w-4 h-4 sm:w-5 sm:h-5"
                } sm:group-hover:text-blue-400 text-blue-400
      `}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </div>
          </div>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip
          className="hidden sm:flex p-1 rounded-sm text-xs bg-gray-500"
          placement="bottom"
          content="Bookmark"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 1 },
          }}
        >
          <div
            onClick={handleAddBookmark}
            className="flex items-center group text-gray-400 bookmark__button"
            ref={ref}
          >
            <div className={'w-9 h-9 sm:group-hover:bg-blue-100 flex items-center rounded-full justify-center  transition ease-in-out cursor-pointer duration-200'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="transparent"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${
                  enlarged ? "w-5 h-5 sm:w-7 sm:h-7" : "w-4 h-4 sm:w-5 sm:h-5"
                } sm:group-hover:text-blue-400`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </div>
          </div>
        </Tooltip>
      );
    }
  }
);

export default BookmarkButton;
