import "./App.css";
import {useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing/Landing";
import { useSelector, useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { loadUser, logout } from "./redux/users/users.actions";
import AuthLayout from "./layout/AuthLayout";

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
        <AuthLayout />
      ) : (
        <Landing />
      )}
    </>
  );
}

export default App;
