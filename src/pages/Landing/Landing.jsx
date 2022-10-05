import React, { useState } from "react";
import twitterBanner from "../../images/twitter-banner.png";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";

const Landing = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const closeRegisterModal = () => setRegisterModal(false);
  const openRegisterModal = () => setRegisterModal(true);

  const closeLoginModal = () => setLoginModal(false);
  const openLoginModal = () => setLoginModal(true);

  return (
    <div className="flex w-full relative h-screen">
      <div className="relative w-1/2 h-full">
        <img src={twitterBanner} alt="" className="bg-blue-400 h-full" />
      </div>

      <div className="w-1/2 h-full flex flex-col mt-40 pl-10">
        <img
          className="m-3 h-14 w-14 mb-20"
          src="https://links.papareact.com/drq"
          alt=""
        />
        <div className="text-7xl font-bold mb-20">Happening Now</div>
        <div className="text-4xl font-bold mb-6">Join Twitter today.</div>
        <div>
          <div
            onClick={openRegisterModal}
            className="border rounded-full mb-12 bg-blue-400 text-white font-semibold w-1/4 py-2 flex items-center justify-center cursor-pointer"
          >
            Sign up with email
          </div>
          <div className="font-bold text-lg mb-5">Already have an account?</div>
          <div
            onClick={openLoginModal}
            className="py-2 flex items-center justify-center font-semibold rounded-full border text-blue-400 w-1/4 cursor-pointer"
          >
            Sign In
          </div>
        </div>
      </div>
      {registerModal ? <RegisterModal closeModal={closeRegisterModal} /> : null}
      {loginModal ? <LoginModal closeModal={closeLoginModal} /> : null}

    
    </div>
  );
};

export default Landing;
