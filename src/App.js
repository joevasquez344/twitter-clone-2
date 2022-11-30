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
  loadUser,
  login,
  logout,
} from "./redux/users/users.actions";
import { SearchIcon } from "@heroicons/react/outline";
import { getPosts } from "./redux/home/home.actions";

function App() {
  const user = useSelector((state) => state.users.user);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (userCredentials) => {
      if (userCredentials) {
        dispatch(loadUser(userCredentials.uid));

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
        <div className="w-full grid grid-cols-9 mx-auto lg:max-w-6xl h-screen">
              <div className="fixed h-10 top-0 border-t bg-white z-50 left-0 right-0 md:hidden">
            Sticky 
          </div>
          <div className=" hidden sm:flex sm:col-span-1 md:flex md:col-span-2 lg:flex lg:col-span-2">
            <Sidebar />
          </div>
          <div className="border-x col-span-9 sm:col-span-7 sm:border-x md:col-span-7 md:border-x lg:col-span-5 lg:border-x xl:border-x">
         
            <Routes>
              {routes.map((route, idx) => (
                <Route
                  key={idx}
                  exact={route.exact}
                  path={route.path}
                  name={route.name}
                  fetchData={() => dispatch(route.fetchData())}
                  element={<route.component />}
                />
              ))}
            </Routes>
          </div>
          <div className="hidden sm:col-span-2 lg:inline px-2 mt-2  overflow-x-hidden">
            <Widgets />
          </div>
          <div className="fixed flex items-center justify-evenly h-10 bottom-0 border-t bg-white z-50 left-0 right-0 md:hidden">
            <div onClick={() => dispatch(logout())}>Logout</div>
            <div onClick={() => navigate(`/${user.username}`)}>Profile</div>
            <div onClick={() => navigate(`/home`)}>Home</div>
            <div onClick={() => navigate(`/bookmarks`)}></div>
          </div>
        </div>
      ) : (
        <Landing />
      )}
    </>
  );
}

export default App;
