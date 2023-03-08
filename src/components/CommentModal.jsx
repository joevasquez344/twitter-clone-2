import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import useAutosizeTextArea from "../hooks/useAuthsizeTextArea";

import { PhotographIcon, XIcon } from "@heroicons/react/outline";
import { createComment } from "../utils/api/comments";
import { storage } from "../firebase/config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import Loader from "./Loader";
import LastSeen from "./LastSeen";
import { useNavigate } from "react-router-dom";
import DefaultAvatar from "./DefaultAvatar";

const CommentModal = ({
  post,
  handleCloseCommentModal,
  redux,
  handleCreateComment,
  updateTweetInFeedAfterCommentCreation,
}) => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageLoading, setSelectedImageLoading] = useState(false);

  const inputRef = useRef(null);
  useAutosizeTextArea(inputRef.current, input);

  const createPost = async (e) => {
    handleCloseCommentModal();
    if (redux === true) {
      handleCreateComment(e, input, post, selectedImageUrl, "modal");
      setInput("");
      setSelectedImage(null);
      setSelectedImageUrl(null);
    } else {
      await createComment(input, post, selectedImageUrl, user, post.postType);
      updateTweetInFeedAfterCommentCreation(post.id);
      setInput("");
      setSelectedImage(null);
      setSelectedImageUrl(null);
    }
  };

  console.log("Selected Image URL: ", selectedImageUrl);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (selectedImageLoading === false) {
      if (input.length === 0 && selectedImageUrl === null) return;

      if (selectedImageUrl !== null && input.length === 0) {
        uploadImage();
        createPost(e);
      } else if (selectedImageUrl !== null && input.length > 0) {
        uploadImage();
        createPost(e);
      } else if (selectedImageUrl === null && input.length > 0) {
        createPost(e);
      }
    }
  };

  const clearSelectedFile = () => {
    // Delete image from Firebase storage in :userId/selected folder on click of 'X'
    setSelectedImage(null);
    setSelectedImageUrl(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImageLoading(true);
    }
    const imageRef = ref(
      storage,
      `${user.id}/selected/${e.target.files[0].name}`
    );
    uploadBytes(imageRef, e.target.files[0])
      .then((res) => {
        listAll(ref(storage, `${user.id}/selected/`)).then((response) => {
          const match = response.items.find(
            (item) => item.fullPath === res.ref.fullPath
          );

          if (match) {
            setSelectedImage(match);
            getDownloadURL(match).then((url) => {
              setSelectedImageUrl(url);
              setSelectedImageLoading(false);
            });
          }
        });
      })
      .catch((err) => {
        alert(`Error ${err.message}`);
      });
  };

  console.log("Hello", input.length);

  const uploadImage = () => {
    if (selectedImage === null) return;
    const imageRef = ref(storage, `${user.id}/uploaded/${selectedImage.name}`);

    uploadBytes(imageRef, selectedImage)
      .then((res) => {
        listAll(ref(storage, `${user.id}`)).then((items) => {
          const match = items.items.find(
            (item) => item.fullPath === res.ref.fullPath
          );

          if (match) setUploadedImage(null);
        });
      })
      .catch((err) => {
        alert(`Error ${err}`);
      });

    // setSelectedImageUrl(null);
    // setSelectedImage(null);
  };
  return (
    <>
      <div
        onClick={handleCloseCommentModal}
        className="bg-black fixed top-0 bottom-0 left-0 right-0 opacity-40 z-50 w-screen h-screen"
      ></div>
      <div className="fixed top-0 left-0 right-0 bottom-0 sm:w-1/4 sm:left-1/3 sm:top-16 sm:bottom-auto z-50 bg-white sm:rounded-xl">
        <div className="pl-4 pt-3 mb-3">
          <div
            onClick={handleCloseCommentModal}
            className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-gray-200  transition ease-in-out cursor-pointer duration-200"
          >
            <XIcon className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
        <div className="px-3">
          <div className="flex w-full">
            {post.avatar === "" || post.avatar === null ? (
              <div className="relativ h-full">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-40">
                  <div className="h-12 w-12 rounded-full flex justify-center items-center">
                    <DefaultAvatar name={post.name} username={post.username} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative h-full">
                <div
                  onClick={() => navigate(`/${post.username}`)}
                  className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-40 cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full flex justify-center items-center">
                    <img
                      // onClick={handleUserDetails}
                      src={post.avatar}
                      alt="Profile Image"
                      className={` object-cover h-12 w-12 rounded-full`}
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center space-x-1">
                <div className="font-semibold">{post.name}</div>
                <div className="text-gray-500">@{post.username}</div>
                <div className="h-0.5 w-0.5 rounded-full bg-gray-500 mr-1.5"></div>
                <div className="text-gray-500">
                  <LastSeen date={new Date(post.timestamp.seconds * 1000)} />
                </div>
              </div>
              <div className="mb-2">{post.message}</div>
              {post.media !== "" ? (
                <img
                  onClick={() =>
                    navigate(`/${post.username}/status/${post.id}`)
                  }
                  src={post.media}
                  alt=""
                  className="ml-0 mb-2 w-full rounded-xl object-cover"
                />
              ) : null}
            </div>
          </div>
          <div className="pb-5">
            <div className="flex w-full">
              <div className="flex w-full">
                {user.avatar === "" || user.avatar === null ? (
                  <div className="relative h-full mt-4">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-40">
                      <div className="h-12 w-12 rounded-full flex justify-center items-center">
                        <DefaultAvatar
                          name={user.name}
                          username={user.username}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full mt-4">
                    <div
                      onClick={() => navigate(`/${user.username}`)}
                      className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-40 cursor-pointer"
                    >
                      <div className="h-12 w-12 rounded-full flex justify-center items-center">
                        <img
                          // onClick={handleUserDetails}
                          src={user.avatar}
                          alt="Profile Image"
                          className={` object-cover h-12 w-12 rounded-full`}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* <img
              className="h-12 w-12 rounded-full object-cover mt-4"
              src="https://picsum.photos/200"
              alt="Profile Image"
            /> */}
                <div className="w-full">
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mt-8 mb-7"
                    action=""
                  >
                    <textarea
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      type="text"
                      ref={inputRef}
                      placeholder="Tweet your reply"
                      className="text-gray-400 text-lg sm:text-xl outline-none w-full resize-none"
                    />
                    {/* <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="text-xl text-gray-900 outline-none"
                  type="text"
                  placeholder="Tweet your reply"
                /> */}
                    {selectedImageLoading ? (
                      <Loader />
                    ) : (
                      <div
                        className={`${
                          selectedImageLoading || selectedImageUrl !== null
                            ? "h-96"
                            : ""
                        } relative mt-5`}
                      >
                        {selectedImage ? (
                          <div
                            className={`${
                              selectedImageLoading || selectedImageUrl !== null
                                ? "h-96"
                                : ""
                            }  object-contain `}
                          >
                            <div
                              onClick={clearSelectedFile}
                              className="absolute z-75 left-3 top-3 cursor-pointer p-1 rounded-full bg-black hover:bg-gray-700 transition ease-in-out duration-150"
                            >
                              <XIcon
                                // onClick={removeBanner}
                                className="w-6 h-6 text-white z-50 cursor-pointer"
                              />
                            </div>
                            <img
                              className="h-96 rounded-xl w-full"
                              src={selectedImageUrl ? selectedImageUrl : ""}
                              alt=""
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </form>
                  <div className="flex items-center justify-between w-full">
                    <div className="relative flex space-x-2 text-blue-400 flex-1">
                      <PhotographIcon className="h-5 w-5 hover:cursor-pointer transition-transform duration-150 ease-out hover:scale-150" />
                      <input
                        onClick={(e) => {
                          return (e.target.value = null);
                        }}
                        onChange={handleFileChange}
                        className="w-5 h-5 z-10 opacity-0 absolute top-0 "
                        name="file"
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                      />
                      {/* <SearchCircleIcon className="h-5 w-5" />
                  <EmojiHappyIcon className="h-5 w-5" />
                  <CalendarIcon className="h-5 w-5" />
                  <LocationMarkerIcon className="h-5 w-5" /> */}
                    </div>

                    <button
                      disabled={
                        input.length === 0 && selectedImageUrl === null
                          ? true
                          : false
                      }
                      onClick={handleCreatePost}
                      className={`text-white ${
                        (input.length === 0 && selectedImageUrl === null) ||
                        selectedImageLoading === true
                          ? "bg-blue-300"
                          : "bg-blue-400"
                      } py-2 px-4 rounded-full cursor-${
                        input.length === 0 && selectedImageUrl === null
                          ? "default"
                          : "pointer"
                      }`}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentModal;
