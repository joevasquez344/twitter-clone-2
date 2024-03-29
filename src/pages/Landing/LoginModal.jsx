import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../../redux/users/users.actions";
import { XIcon } from "@heroicons/react/outline";
const LoginModal = ({ closeModal }) => {
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
        className="flex flex-col fixed right-0 top-0 left-0 bottom-0 lg:absolute lg:top-10 lg:bottom-60 lg:right-1/3 lg:left-1/3 bg-white p-5 lg:w-1/3 border rounded-xl justify-center"
      >
        <div className="md:absolute md:top-10 md:left-10 md:right-10">
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
              type="password"
              placeholder="Password"
              className="border rounded-md p-2"
            />

            <button
              className="bg-gray-400 mx-auto w-full p-3 md:w-1/3 lg:w-1/2 xl:w-1/3 rounded-full text-white"
              onClick={handleLogin}
            >
              Sign In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;
