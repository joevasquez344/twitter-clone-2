import "./App.css";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing/Landing";
import { useSelector, useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAuthUser, logout } from "./redux/users/users.actions";
import AuthLayout from "./layout/AuthLayout";
import { getBookmarks } from "./redux/bookmarks/bookmarks.actions";
import { ExploreProvider } from "./pages/Explore/ExploreContext";

function App() {
  const user = useSelector((state) => state.users.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadUser = (authId) => {
        dispatch(getAuthUser(authId));
        dispatch(getBookmarks(authId))

  }


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (userCredentials) => {
      if (userCredentials) {
        // dispatch(getAuth(userCredentials.uid));
        loadUser(userCredentials.uid);
        // navigate("/explore");
      } else {
        dispatch(logout());
        navigate("/");
      }
    });
  }, []);

  return (
    <>
      {user ? (
        <AuthLayout />
      ) : (
        <Landing />
      )}
    </>
  );
}

export default App;
