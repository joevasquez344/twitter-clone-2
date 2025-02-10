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

function App() {
  const user = useSelector((state) => state.users.user);

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
        <>
          <MobileHeader />
          <MobileTweetButton openModal={handleOpenTweetModal} />

          <div className="w-full grid grid-cols-9 mx-auto lg:max-w-6xl h-screen">
            <div className="hidden sm:flex sm:col-span-1 md:flex md:col-span-2 lg:flex lg:col-span-2">
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
            </div>
            <div className="hidden sm:col-span-2 lg:inline px-2 mt-2  overflow-x-hidden">
              <Widgets />
            </div>

            <MobileNavbar openModal={() => setSearchModal(true)} />
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
    </>
  );
}

export default App;
