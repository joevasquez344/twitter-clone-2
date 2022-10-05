import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/users/users.actions";
import { XIcon } from "@heroicons/react/outline";
const RegisterModal = ({closeModal}) => {
  const registerError = useSelector((state) => state.users.error);
  const dispatch = useDispatch();

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
  return (
    <div>
      <form
        onSubmit={handleRegister}
        className="flex flex-col absolute top-1/4 right-1/3 bg-white p-5 w-1/3 border rounded-xl justify-center"
      >
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
            type="text"
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

          <input onChange={handleBirthdayChange} value={birthday} type="date" />
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
        </div>

        <button
          className="bg-gray-400 m-auto w-2/3 p-3 rounded-full text-white"
          onClick={handleRegister}
        >
          Sign Up
        </button>
        {registerError && <div>{registerError}</div>}
      </form>

      {registerError && <div>{registerError}</div>}
    </div>
  );
};

export default RegisterModal;
