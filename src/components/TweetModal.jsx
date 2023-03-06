import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PhotographIcon, XIcon } from "@heroicons/react/outline";
import { storage } from "../firebase/config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import {
  collection,
  writeBatch,
  doc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore/lite";
import { addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

import { createTweet, getPosts } from "../redux/home/home.actions";
import useAutosizeTextArea from "../hooks/useAuthsizeTextArea";
import { useRef } from "react";
import DefaultAvatar from "./DefaultAvatar";

const TweetModal = ({ closeModal }) => {
  const authUser = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageLoading, setSelectedImageLoading] = useState(false);

  const inputRef = useRef(null);
  useAutosizeTextArea(inputRef.current, input);

  const createPost = async (e) => {
    closeModal();
    dispatch(createTweet(selectedImageUrl, input));
    setInput("");
    setSelectedImage(null);
    setSelectedImageUrl(null);
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
      `${authUser.id}/selected/${e.target.files[0].name}`
    );
    uploadBytes(imageRef, e.target.files[0])
      .then((res) => {
        listAll(ref(storage, `${authUser.id}/selected/`)).then((response) => {
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
    const imageRef = ref(
      storage,
      `${authUser.id}/uploaded/${selectedImage.name}`
    );

    uploadBytes(imageRef, selectedImage)
      .then((res) => {
        listAll(ref(storage, `${authUser.id}`)).then((items) => {
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
        onClick={closeModal}
        className="bg-black fixed top-0 bottom-0 left-0 right-0 opacity-40 z-50 w-screen h-screen"
      ></div>
      <div className="fixed top-0 right-0 bottom-0 left-0 sm:w-1/4 sm:left-1/3 sm:top-16 sm:bottom-auto z-50 bg-white sm:rounded-xl">
        <div className="pl-4 pt-3 mb-3">
          <div className="w-9 h-9 flex justify-center items-center rounded-full hover:bg-gray-200  transition ease-in-out cursor-pointer duration-200">
            <XIcon onClick={closeModal} className="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex w-full">
            {authUser.avatar === "" || authUser.avatar === null ? (
              <div className="relative h-full mt-4">
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-40">
                  <div className="h-12 w-12 rounded-full flex justify-center items-center">
                    <DefaultAvatar
                      name={authUser.name}
                      username={authUser.username}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative h-full mt-4">
                <div
                  onClick={() => navigate(`/${authUser.username}`)}
                  className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-40 cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full flex justify-center items-center">
                    <img
                      // onClick={handleUserDetails}
                      src={authUser.avatar}
                      alt="Profile Image"
                      className={` object-cover h-12 w-12 rounded-full`}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="ml-3 w-full">
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
                  placeholder="What's Happening?"
                  className="text-gray-400 text-lg sm:text-xl outline-none w-full resize-none"
                />
                {/* <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="text-xl text-gray-900 outline-none"
                  type="text"
                  placeholder="What's Happening?"
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
                  Tweet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TweetModal;
