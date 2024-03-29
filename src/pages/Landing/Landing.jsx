import React, { useState } from "react";
import twitterBanner from "../../images/twitter-banner.png";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { useDispatch } from "react-redux";
import { login } from "../../redux/users/users.actions";

const Landing = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const closeRegisterModal = () => setRegisterModal(false);
  const openRegisterModal = () => setRegisterModal(true);

  const closeLoginModal = () => setLoginModal(false);
  const openLoginModal = () => setLoginModal(true);

  const dispatch = useDispatch();

  const loginWithDemoMode = () => {
    dispatch(login("demo@gmail.com", "demo123"));

  }

  return (
    <div className="xs:flex xs:flex-col md:flex md:flex-row w-full relative h-screen">
      <div className=" relative hidden lg:flex w-1/2 h-full">
        <img src={twitterBanner} alt="" className="bg-blue-400 h-full" />
      </div>

      <div className="w-full px-4 sm:w-1/2 sm:mx-auto h-full flex flex-col pt-40 md:pl-5 lg:pl-10">
        <img
          className=" h-14 mb-10 w-14 md:mb-20"
          src="https://links.papareact.com/drq"
          alt=""
        />
        <div className="text-4xl mb-10 md:text-7xl w-full font-bold md:mb-20">Happening Now</div>
        <div className="text-2xl md:text-4xl w-full font-bold mb-6">Join Twitter today.</div>
        <>
          <div
            onClick={openRegisterModal}
            className="w-full rounded-full mb-12 bg-blue-400 text-white font-semibold py-2 flex items-center justify-center cursor-pointer  md:w-2/3 lg:w-2/5 xl:w-1/3"
          >
            Sign up with email
          </div>
          <div className="font-bold text-lg mb-5">Already have an account?</div>
          <div
            onClick={openLoginModal}
            className="py-2 flex items-center justify-center font-semibold rounded-full border text-blue-400 w-full cursor-pointer md:w-2/3 lg:w-2/5 xl:w-1/3"
          >
            Sign In
          </div>
        </>
        <div>
          <div className="text-2xl font-semibold mt-10">Demo Mode</div>
          <div className="mt-2 w-full sm:w-2/3 md:w-1/2">
            Demo account that has existing followers, tweets, bookmarks, and liked tweets for the purpose of experiencing the application if full immediately.
          </div>
          <div
          onClick={loginWithDemoMode}
            className="py-2 mt-5 flex items-center justify-center font-semibold rounded-full border text-blue-400 w-full cursor-pointer md:w-2/3 lg:w-2/5 xl:w-1/3"
          >
            Access Demo Account
          </div>
        </div>
      </div>
      {registerModal ? <RegisterModal closeModal={closeRegisterModal} /> : null}
      {loginModal ? <LoginModal closeModal={closeLoginModal} /> : null}

    
    </div>
  );
};

export default Landing;
