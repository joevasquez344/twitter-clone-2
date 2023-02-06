import React, { useState, useRef } from "react";
import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from "@heroicons/react/outline";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../firebase/config";
import { storage } from "../firebase/config";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
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
import { getPosts } from "../redux/home/home.actions";
import { getProfileFollowing } from "../utils/api/users";
import Loader from "./Loader";
import { useEffect } from "react";
import DefaultAvatar from "./DefaultAvatar";
import { XIcon } from "@heroicons/react/outline";

const TweetBox = ({ setLoading, setGiphyModal }) => {
  const user = useSelector((state) => state.users.user);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageLoading, setSelectedImageLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const createPost = async () => {
    const postsRef = collection(db, `posts`);

    const postData = {
      uid: user.id,
      userRef: doc(db, `users/${user.id}`),
      name: user.name,
      email: user.email,
      username: user.username,
      message: input,
      media: selectedImageUrl ? selectedImageUrl : "",
      avatar: user.avatar,
      timestamp: serverTimestamp(),
      postType: "tweet",
      replyTo: doc(db, `posts/${null}`),
      pinnedPost: false,
      // replyToUsers: [],
    };

    await addDoc(postsRef, postData);

    await dispatch(getPosts(user));

    setInput("");
    setLoading(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    setInput("");
    if (selectedImageLoading === false) {
      setLoading(true);

      if (input === "") return;

      if (selectedImageUrl !== null) {
        uploadImage();
        createPost();
      } else {
        createPost();
      }

      setSelectedImage(null);
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
    <div className="hidden sm:flex px-2 pb-5 border-b">
      <div className="flex">
        {user.avatar === "" || user.avatar === null ? (
          <div className="relative h-full mt-4">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center z-40">
              <div className="h-12 w-12 rounded-full flex justify-center items-center">
                <DefaultAvatar name={user.name} username={user.username} />
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

        <div className="ml-3 w-full">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 mb-7"
            action=""
          >
            <input
              value={input}
              onChange={handleInputChange}
              className="text-md sm:text-xl text-gray-900 outline-none"
              type="text"
              placeholder="What's happening?"
            />
            {/* {imageUrlBoxIsOpen && (
              <form className="mt-5 flex rounded-lf bg-blue-400 py-2 px-4 rounded">
                <input
                  ref={imageInputRef}
                  className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                  type="text"
                  placeholder="Enter Image URL..."
                />
                <button
                  type="submit"
                  onClick={addImageToTweet}
                  className="font-bold text-white"
                >
                  Add Image
                </button>
              </form>
            )} */}
            {selectedImageLoading ? (
              <Loader />
            ) : (
              <div
                className={`${
                  selectedImageLoading || selectedImageUrl !== null
                    ? "h-36 sm:h-96"
                    : ""
                } relative mt-5`}
              >
                {selectedImageUrl !== null ? (
                  <div
                    className={`${
                      selectedImageLoading || selectedImageUrl !== null
                        ? "h-36 sm:h-96"
                        : ""
                    }  object-contain`}
                  >
                    <div
                      onClick={clearSelectedFile}
                      className="absolute z-75 left-3 top-3 cursor-pointer rounded-full p-1 bg-black hover:bg-gray-700 transition ease-in-out duration-150"
                    >
                      <XIcon
                        // onClick={removeBanner}
                        className="h-4 w-4 sm:w-6 sm:h-6  text-white cursor-pointer"
                      />
                    </div>
                    <img
                      className="h-36 sm:h-96 rounded-xl"
                      src={selectedImageUrl ? selectedImageUrl : ""}
                      alt=""
                    />
                  </div>
                ) : null}
              </div>
            )}
          </form>

          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2 text-blue-400 flex-1">
              <div className="relative cursor-pointer transition-transform duration-150 ease-out hover:scale-125">
                <PhotographIcon className="h-5 w-5 z-50 hover:cursor-pointer transition-transform duration-150 ease-out hover:scale-150" />
                <input
                  onClick={(e) => {
                    return (e.target.value = null);
                  }}
                  onChange={handleFileChange}
                  className="w-5 h-5 z-10 opacity-0 absolute top-0 "
                  name="file"
                  type="file"
                />
              </div>
              {/* <SearchCircleIcon
                onClick={() => setGiphyModal(true)}
                className="h-5 w-5"
              />
              <EmojiHappyIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <LocationMarkerIcon className="h-5 w-5" /> */}
            </div>
            {input && selectedImageLoading ? null : (
              <button
                onClick={handleCreatePost}
                // disabled={input || selectedImageLoading ? true : false}
                className={`text-white bg-blue-${
                  input === "" ? "300" : "400"
                } py-2 px-4 rounded-full cursor-${
                  input === "" ? "default" : "pointer"
                } ${input === "" ? "hidden" : "flex"}`}
              >
                Tweet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetBox;
