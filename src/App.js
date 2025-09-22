import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Widgets from "./layout/Widgets";
import routes from "./routes";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing/Landing";
import { useSelector, useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { loadUser, logout } from "./redux/users/users.actions";
import DefaultAvatar from "./components/DefaultAvatar";
import SearchBar from "./components/SearchBar";
import { getAllUsers, getProfileFollowing } from "./utils/api/users";
import SearchModal from "./components/SearchModal";
import TweetModal from "./components/TweetModal";
import MobileHeader from "./layout/MobileHeader";
import MobileTweetButton from "./layout/MobileTweetButton";
import MobileNavbar from "./layout/MobileNavbar";
import UserSearchContainer from "./layout/UserSearchContainer";
import AppContainer from "./layout/AppContainer";

function App() {
  const user = useSelector((state) => state.users.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (userCredentials) => {
      if (userCredentials) {
        dispatch(loadUser(userCredentials.uid));
        navigate("/home");
      } else {
        dispatch(logout());
        navigate("/");
      }
    });
  }, []);

  return (
    <>
      {user ? (

        <AppContainer />
        // <>
        //   <MobileHeader />
        //   <MobileTweetButton openModal={handleOpenTweetModal} />
        //   <MobileNavbar openModal={() => setSearchModal(true)} />

        //   <div className="w-full grid grid-cols-9 mx-auto lg:max-w-6xl h-screen">
        //     <div className="hidden sm:flex sm:col-span-1 md:flex md:col-span-2 lg:flex lg:col-span-2">
        //       <Sidebar />
        //     </div>
        //     <div className="relative border-x col-span-9 pb-16 sm:mb-0 sm:col-span-7 sm:border-x md:col-span-7 md:border-x lg:col-span-5 lg:border-x xl:border-x">
        //       <Routes>
        //         {routes.map((route, idx) => (
        //           <Route
        //             key={idx}
        //             exact={route.exact}
        //             path={route.path}
        //             name={route.name}
        //             fetchData={() => dispatch(route.fetchData())}
        //             element={<route.component />}
        //           />
        //         ))}
        //       </Routes>
        //     </div>
        //     <div className="hidden sm:col-span-2 lg:inline px-2 mt-2  overflow-x-hidden">
        //       <Widgets />
        //     </div>
        //   </div>
        //   {searchModal && <UserSearchContainer />}
        //   {tweetModal && <TweetModal closeModal={handleCloseTweetModal} />}
        // </>
      ) : (
        <Landing />
      )}
    </>
  );
}

export default App;
