import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, login } from "../redux/users/users.actions";

const Landing = ({ modal, closeModal, openModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [email2, setEmail2] = useState("");
  const [password2, setPassword2] = useState("");

  const registerError = useSelector((state) => state.users.error);
  const dispatch = useDispatch();

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleBirthdayChange = (e) => setBirthday(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);

  console.log("Date: ", birthday);
  const handlePasswordChange2 = (e) => {
    setPassword2(e.target.value);
  };
  const handleEmailChange2 = (e) => {
    setEmail2(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(email2, password2));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
      name,
      username,
      birthday,
      bio,
      location
    };
    dispatch(register(data));
  };
  return (
    <div className="flex w-full relative">
      <div className="bg-blue-400 w-1/2 max-h-screen">f</div>
      <div className="w-1/2 max-h-screen">
        <img
          className="m-3 h-10 w-10"
          src="https://links.papareact.com/drq"
          alt=""
        />
        <div className="text-7xl font-bold mb-10">Happening Now</div>
        <div className="text-4xl font-bold mb-6">Join Twitter today</div>
        <div>
          <div
            onClick={openModal}
            className="border rounded-full w-40 flex items-center justify-center"
          >
            Sign Up
          </div>
          <div className="border rounded-full w-40 flex items-center justify-center">
            Sign In
          </div>
        </div>
      </div>
      <div
        className={`${
          modal
            ? "flex absolute right-11 -bottom-96 bg-white p-2 w-1/2 border flex justify-center"
            : "hidden"
        }`}
      >
        <form
          onSubmit={handleRegister}
          className="flex flex-col w-1/2 space-y-3"
        >
          <div>Register</div>
          <input
            value={email}
            onChange={handleEmailChange}
            type="text"
            placeholder="Email"
            className="border rounded-md p-2"
          />
          <input
            onChange={handleNameChange}
            value={name}
            type="text"
            placeholder="Name"
          />
          <input
            value={password}
            onChange={handlePasswordChange}
            type="text"
            placeholder="Password"
            className="border rounded-md p-2"
          />
          <input onChange={handleBirthdayChange} value={birthday} type="date" />
          <input
            onChange={handleBioChange}
            value={bio}
            type="text"
            placeholder="Bio"
          />
          <input
            onChange={handleUsernameChange}
            value={username}
            type="text"
            placeholder="Username"
          />
          <input
            onChange={handleLocationChange}
            value={location}
            type="text"
            placeholder="Location"
          />

          <button onClick={handleRegister}>Submit</button>
          {registerError && <div>{registerError}</div>}
        </form>
        <form onSubmit={handleLogin} className="flex flex-col w-1/2 space-y-3">
          <div>Login</div>
          <input
            value={email2}
            onChange={handleEmailChange2}
            type="text"
            placeholder="Email"
            className="border rounded-md p-2"
          />
          <input
            value={password2}
            onChange={handlePasswordChange2}
            type="text"
            placeholder="Password"
            className="border rounded-md p-2"
          />

          <button onClick={handleLogin}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Landing;
