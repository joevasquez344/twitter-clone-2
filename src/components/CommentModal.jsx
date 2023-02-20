import React, { useState } from "react";
import { useSelector } from "react-redux";

import { PhotographIcon, XIcon } from "@heroicons/react/outline";
import { createComment } from "../utils/api/comments";
import { storage } from "../firebase/config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import Loader from "./Loader";
import LastSeen from "./LastSeen";

const CommentModal = ({
  post,
  handleCloseCommentModal,
  redux,
  handleCreateComment,
  updateTweetInFeedAfterCommentCreation,
}) => {
  const user = useSelector((state) => state.users.user);

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageLoading, setSelectedImageLoading] = useState(false);

  console.log("Selected Image: ", selectedImageLoading);

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
      <div className="fixed top-0 left-0 right-0 bottom-0 sm:w-1/4 sm:left-1/2.5 sm:top-16 z-50 bg-white sm:rounded-xl">
        <div className="pl-4 pt-3 mb-3">
          <div className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-gray-200  transition ease-in-out cursor-pointer duration-200">
            <XIcon
              onClick={handleCloseCommentModal}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </div>
        <div className="px-5 pt-5 pb-4 flex">
          <img
            className="h-12 w-12 mr-3 rounded-full object-cover"
            src="https://picsum.photos/200"
            alt=""
          />

          <div>
            <div className="flex items-center space-x-1">
              <div className="font-semibold">{post.name}</div>
              <div className="text-gray-500">@{post.username}</div>
              <div className="h-0.5 w-0.5 rounded-full bg-gray-500 mr-1.5"></div>
              <div className="text-gray-500">
                <LastSeen date={new Date(post.timestamp.seconds * 1000)} />
              </div>
            </div>
            {post.message}
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="flex w-full">
            <img
              className="h-12 w-12 rounded-full object-cover mt-4"
              src="https://picsum.photos/200"
              alt="Profile Image"
            />
            <div className="ml-3 w-full">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-8 mb-7"
                action=""
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="text-xl text-gray-900 outline-none"
                  type="text"
                  placeholder="Tweet your reply"
                />
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
    </>
  );
};

export default CommentModal;
