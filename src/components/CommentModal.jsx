import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PhotographIcon, XIcon } from "@heroicons/react/outline";
import { createComment } from "../utils/api/comments";
import { storage } from "../firebase/config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import Loader from "./Loader";

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

  const createPost = async (e) => {
    handleCloseCommentModal();
    if (redux === true) {
      handleCreateComment(e, input, post, selectedImageUrl);
      setInput("");
    } else {
      await createComment(input, post, selectedImageUrl, user, post.postType);
      updateTweetInFeedAfterCommentCreation(post.id);
      setInput("");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setInput("");
    if (selectedImageLoading === false) {
      if (input === "") return;

      if (selectedImageUrl !== null) {
        uploadImage();
        createPost(e);
      } else {
        createPost(e);
      }

      setSelectedImage(null);
    }
  };

  const clearSelectedFile = () => {
    // Delete image from Firebase storage in :userId/selected folder on click of 'X'
    setSelectedImage(null);
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

    setSelectedImageUrl(null);
    setSelectedImage(null);
  };
  return (
    <div>
      <div
        onClick={handleCloseCommentModal}
        className="bg-black fixed top-0 bottom-0 left-0 right-0 opacity-40 z-50 w-screen h-screen"
      ></div>
      <div className="fixed w-1/4 left-1/2.5 top-16 z-50 shadow-lg bg-white">
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
            <div className="flex space-x-1">
              <div className="font-semibold">{post.name}</div>
              <div className="text-gray-500">@{post.username}</div>
              <div className="text-gray-500">Time</div>
            </div>
            {post.message}
          </div>
        </div>
        <div className="px-5 pb-5 border-b">
          <div className="flex w-full">
            <img
              className="h-12 w-12 rounded-full object-cover mt-4"
              src="https://picsum.photos/200"
              alt="Profile Image"
            />
            <div className="ml-3 w-full">
              <form
                onSubmit={
                  input && selectedImageLoading
                    ? (e) => {
                        e.preventDefault();
                      }
                    : handleCreatePost
                }
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
                  <>
                    {selectedImage ? (
                      <div className="mt-10 h-40 w-40 rounded-xl object-contain shadow-lg relative">
                        <div
                          onClick={clearSelectedFile}
                          className="absolute right-0 cursor-pointer"
                        >
                          X
                        </div>
                        <img
                          className="h-40 w-40 rounded"
                          src={selectedImageUrl ? selectedImageUrl : ""}
                          alt=""
                        />
                      </div>
                    ) : null}
                  </>
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
                {input && selectedImageLoading ? null : (
                  <div
                    onClick={handleCreatePost}
                    className={`text-white bg-blue-${
                      input === "" ? "300" : "400"
                    } py-2 px-4 rounded-full cursor-${
                      input === "" ? "default" : "pointer"
                    } ${input === "" ? "hidden" : "flex"}`}
                  >
                    Tweet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
