import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/users/users.actions";
import { XIcon } from "@heroicons/react/outline";

import { db } from "../../firebase/config";
import { writeBatch } from "firebase/firestore/lite";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  where,
} from "firebase/firestore";
const RegisterModal = ({ closeModal }) => {
  const registerError = useSelector((state) => state.users.error);
  const dispatch = useDispatch();

  const [error, setError] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleBirthdayChange = (e) => setBirthday(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);

  const fetchUsernames = async () => {
    const ref = collection(db, "users");
    const snapshot = await getDocs(ref);
    const usernames = snapshot.docs.map((doc) => doc.data());
    console.log("Usernames: ", usernames);
  };

  function usernameValidation() {
    let whiteSpace = username.indexOf(" ") >= 0;
    if (whiteSpace) {
      setError("Username cannot have any spaces");

      return;
    }
  }

  const handleRegister = (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
      name,
      username,
      birthday,
      bio,
      location,
    };
    dispatch(register(data));
  };

  useEffect(() => {
    fetchUsernames();
  }, []);
  return (
    <div>
      <form
        onSubmit={handleRegister}
        className="flex flex-col fixed right-0 top-0 left-0 bottom-0 lg:absolute lg:top-10 lg:bottom-10 lg:right-1/3 lg:left-1/3 bg-white p-5 lg:w-1/3 border rounded-xl justify-center"
      >
        <div className="md:absolute md:top-10 md:left-10 md:right-10">
          <XIcon onClick={closeModal} className="h-5 w-5 mb-9 cursor-pointer" />

          <div className="text-3xl font-bold mb-8">Create your account</div>
          <div className="flex flex-col space-y-5 mb-10">
            <input
              value={email}
              onChange={handleEmailChange}
              type="text"
              placeholder="Email"
              className="border rounded-md p-2"
            />
            <input
              value={password}
              onChange={handlePasswordChange}
              type="password"
              placeholder="Password"
              className="border rounded-md p-2"
            />
            <input
              onChange={handleNameChange}
              value={name}
              type="text"
              placeholder="Name"
              className="border rounded-md p-2"
            />

            <input
              onChange={handleBirthdayChange}
              value={birthday}
              type="date"
            />
            <input
              onChange={handleBioChange}
              value={bio}
              type="text"
              placeholder="Bio"
              className="border rounded-md p-2"
            />
            <input
              onChange={handleUsernameChange}
              value={username}
              type="text"
              placeholder="Username"
              className="border rounded-md p-2"
            />
            <input
              onChange={handleLocationChange}
              value={location}
              type="text"
              placeholder="Location"
              className="border rounded-md p-2"
            />
            <button
              className="bg-gray-400 mx-auto w-full  md:w-1/3 lg:w-1/2 xl:w-1/3 p-3 rounded-full text-white"
              onClick={handleRegister}
            >
              Sign Up
            </button>
          </div>

          {error !== null && (
            <div className="mt-5 text-red-500 font-bold">{error}</div>
          )}
          {registerError && <div className="mt-10">{registerError}</div>}
        </div>
      </form>
    </div>
  );
};

export default RegisterModal;
