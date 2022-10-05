import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Widgets from "./layout/Widgets";
import routes from "./routes";
import { useState, useEffect } from "react";
import Landing from "./pages/Landing/Landing";
import uuid from "react-uuid";
import { useSelector, useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { LOGIN_SUCCESS, LOGOUT } from "./redux/users/users.types";
import {
  loadUserFromFirestore,
  login,
  logout,
} from "./redux/users/users.actions";
import {
  SearchIcon
} from "@heroicons/react/outline";

function App() {
  const user = useSelector((state) => state.users.user);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // document.addEventListener("wheel", (e) => {
  //   e.preventDefault();

  //   EventTarget.scrollBy(e.deltaX, e.deltaY);
  // })

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (userCredentials) => {
      if (userCredentials) {
        console.log("userCredentials: ", userCredentials);
        dispatch(loadUserFromFirestore(userCredentials.uid));

        if (location.pathname === "/") navigate("/home");
      } else {
        dispatch(logout());
        navigate("/");
      }
    });
  }, []);

  return (
    <>
      {user ? (
        <div className=" grid grid-cols-9 mx-auto lg:max-w-6xl h-screen">
          <div className=" hidden sm:flex sm:col-span-1 md:flex md:col-span-2 lg:flex lg:col-span-2">
            <Sidebar />
          </div>
          <div className="border-x col-span-9 sm:col-span-7 sm:border-x md:col-span-7 md:border-x lg:col-span-5 lg:border-x xl:border-x">
            <div className="flex items-center mx-4 space-x-2 bg-gray-100 p-3 rounded-full mt-6">
              <SearchIcon className="h-5 w-5 text-gray-400" />
              <input
                className="bg-transparent flex-1 outline-none"
                type="text"
                placeholder="Search Profiles"
              />
            </div>
            <Routes>
              {routes.map((route, idx) => (
                <Route
                  key={idx}
                  exact={route.exact}
                  path={route.path}
                  name={route.name}
                  element={<route.component />}
                />
              ))}
            </Routes>
          </div>
          <div className="hidden sm:col-span-2 lg:inline px-2 mt-2  overflow-x-hidden">
            <Widgets />
          </div>
        </div>
      ) : (
        <Landing />
      )}
    </>
  );
}

export default App;
