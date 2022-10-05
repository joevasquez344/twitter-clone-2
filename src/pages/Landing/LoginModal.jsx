import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../../redux/users/users.actions";
import { XIcon } from "@heroicons/react/outline";
const LoginModal = ({closeModal}) => {
  const registerError = useSelector((state) => state.users.error);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col absolute top-1/4 right-1/3 bg-white p-5 w-1/3 border rounded-xl justify-center"
      >
        <XIcon onClick={closeModal} className="h-5 w-5 mb-9 cursor-pointer" />

        <div className="text-3xl font-bold mb-8">Sign in to Twitter</div>
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

          <button
            className="bg-gray-400 m-auto w-2/3 p-3 rounded-full text-white"
            onClick={handleLogin}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;
