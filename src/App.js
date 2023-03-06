import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
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

function App() {
  const user = useSelector((state) => state.users.user);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [tweetModal, setTweetModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const handleCloseTweetModal = () => setTweetModal(false);
  const handleOpenTweetModal = () => setTweetModal(true);

  const fetchAllUsers = async () => {
    const users = await getAllUsers();
    setLoadingUsers(false);

    return users;
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    const searchResults = allUsers.filter(
      (user) =>
        user.username.toLowerCase().match(e.target.value.toLowerCase()) ||
        user.username.toUpperCase().match(e.target.value.toUpperCase()) ||
        user.name.toUpperCase().match(e.target.value.toUpperCase()) ||
        user.name.toUpperCase().match(e.target.value.toUpperCase())
    );

    setSearchedUsers(searchResults);
  };

  const handleOpenSearchModal = async () => {
    setSearchModal(true);
    setSearchInput("");

    let users = await fetchAllUsers();
    let authFollowing = await getProfileFollowing(user.id);

    users = users.map((user) => {
      const authFollowsListUser = authFollowing.find(
        (profile) => profile.id === user.id
      );

      const listUserFollowsAuth = user.following.find(
        (profile) => profile.id === user.id
      );

      if (listUserFollowsAuth && authFollowsListUser) {
        user.display = "You follow each other";
      } else if (listUserFollowsAuth && !authFollowsListUser) {
        user.display = "Follows you";
      } else if (authFollowsListUser && !listUserFollowsAuth) {
        user.display = "Following";
      } else {
        user.display = null;
      }

      return user;
    });

    setAllUsers(users);
  };
  const handleCloseSearchModal = () => {
    setSearchModal(false);
  };

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
  }, [user]);

  return (
    <div className="bg-white">
      {user ? (
        <>
          <div className="w-full grid grid-cols-9 mx-auto lg:max-w-6xl h-screen">
            <div
              className={`fixed ${
                location.pathname === "/home" ? "flex" : "hidden"
              } items-center justify-center h-20  top-0 shadow-sm  bg-white z-50 left-0 right-0 sm:hidden`}
            >
              <div className="absolute left-5">
                {user.avatar === "" || user.avatar === null ? (
                  <div
                    onClick={() => navigate(`/${user.username}`)}
                    className="relative"
                  >
                    <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center z-40">
                      <div className="h-7 w-7 rounded-full flex justify-center items-center">
                        <DefaultAvatar
                          height="7"
                          width="7"
                          name={user.name}
                          username={user.username}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      onClick={() => navigate(`/${user.username}`)}
                      className="h-7 w-7 rounded-full bg-white flex items-center justify-center z-40 cursor-pointer"
                    >
                      <div className="h-7 w-7 rounded-full flex justify-center items-center">
                        <img
                          // onClick={handleUserDetails}
                          src={user.avatar}
                          alt="Profile Image"
                          className={` object-cover h-7 w-7 rounded-full`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <img
                className=" h-7 w-7"
                src="https://links.papareact.com/drq"
                alt=""
              />
            </div>
            <div className=" hidden sm:flex sm:col-span-1 md:flex md:col-span-2 lg:flex lg:col-span-2">
              <Sidebar />
            </div>
            <div className="relative border-x col-span-9 pb-16 sm:mb-0 sm:col-span-7 sm:border-x md:col-span-7 md:border-x lg:col-span-5 lg:border-x xl:border-x">
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
              <div
                onClick={handleOpenTweetModal}
                className="fixed bottom-20 right-3 sm:hidden bg-blue-400 rounded-full flex items-center justify-center w-12 h-12"
              >
                <i className="fa-solid fa-plus text-white"></i>
              </div>
            </div>
            <div className="hidden sm:col-span-2 lg:inline px-2 mt-2  overflow-x-hidden">
              <Widgets />
            </div>

            <div className=" sm:hidden fixed bottom-0 left-0 right-0 flex items-center justify-evenly h-16 border-t bg-white z-50">
              <div onClick={() => navigate("/home")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </div>
              <div onClick={() => setSearchModal(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <div onClick={() => navigate(`/bookmarks`)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"
                  />
                </svg>
              </div>
              <div onClick={() => dispatch(logout())}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </div>
            </div>
          </div>
          {searchModal && (
            <>
              <div
                onClick={() => setSearchModal(false)}
                className="fixed left-0 top-0 bottom-0 right-0 z-50"
              ></div>
              <div className="inline sm:hidden fixed top-16 left-0 right-0 bg-white z-50 mx-4">
                <SearchBar
                  input={searchInput}
                  inputChange={handleSearchInput}
                  searchModal={searchModal}
                  openModal={handleOpenSearchModal}
                  closeModal={handleCloseSearchModal}
                  loadingUsers={loadingUsers}
                  mobile={true}
                />
                <div className="relative">
                  <div className="text-xl font-bold">Home</div>{" "}
                  {searchModal && (
                    <SearchModal
                      searchedUsers={searchedUsers}
                      input={searchInput}
                      mobile={true}
                      closeModal={handleCloseSearchModal}
                      loadingUsers={loadingUsers}
                    />
                  )}
                </div>
              </div>
            </>
          )}
          {tweetModal && <TweetModal closeModal={handleCloseTweetModal} />}
        </>
      ) : (
        <Landing />
      )}
    </div>
  );
}

export default App;
