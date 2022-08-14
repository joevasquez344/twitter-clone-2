import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Widgets from "./layout/Widgets";
import routes from "./routes";
import { useState, useEffect, useReducer } from "react";
import Landing from "./pages/Landing";
import uuid from "react-uuid";
import { useSelector, useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { LOGIN_SUCCESS, LOGOUT } from "./redux/users/users.types";
import { loadUserFromFirestore, login, logout } from "./redux/users/users.actions";

function App() {
  // const [user, setUser] = useState({});
  const [modal, setModal] = useState(false);
  const user = useSelector((state) => state.users.user);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeModal = () => setModal(false);
  const openModal = () => setModal(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (userCredentials) => {
      if (userCredentials) {
        console.log('userCredentials: ', userCredentials)
        dispatch(loadUserFromFirestore(userCredentials.uid))
        // dispatch({
        //   type: LOGIN_SUCCESS,
        //   payload: { id: userCredentials.uid, email: userCredentials.email },
        // });

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
        <div className="grid grid-cols-9 mx-auto lg:max-w-6xl max-h-screen overflow-scroll overflow-x-hidden ">
          <div className="col-span-2">
            <Sidebar />
          </div>
          <div className="col-span-7 lg:col-span-5 border-x">
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
          <div className="col-span-2 px-2 mt-2 hidden lg:inline">
            <Widgets />
          </div>
        </div>
      ) : (
        <Landing modal={modal} openModal={openModal} closeModal={closeModal} />
      )}
    </>
  );
}

export default App;
