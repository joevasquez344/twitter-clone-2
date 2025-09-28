import { Suspense } from "react";

import { Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";
import { routes, exploreRoutes, LazyExplore } from "../routes";
import { useState } from "react";
import { useDispatch } from "react-redux";

import TweetModal from "../components/TweetModal";
import MobileHeader from "./MobileHeader";
import MobileTweetButton from "./MobileTweetButton";
import MobileNavbar from "./MobileNavbar";
import UserSearchContainer from "./UserSearchContainer";
import Loader from "../components/Loader";
import { ExploreProvider } from "../pages/Explore/ExploreContext";

const AuthLayout = () => {
  const dispatch = useDispatch();

  const [tweetModal, setTweetModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);

  const handleCloseTweetModal = () => setTweetModal(false);
  const handleOpenTweetModal = () => setTweetModal(true);
  return (
    <>
      <MobileHeader />
      <MobileTweetButton openModal={handleOpenTweetModal} />
      <MobileNavbar openModal={() => setSearchModal(true)} />

      <div className="w-full grid grid-cols-9 mx-auto lg:max-w-6xl h-screen">
        <div className="hidden sm:flex sm:col-span-1 md:flex md:col-span-2 lg:flex lg:col-span-2">
          <Sidebar />
        </div>
        <div className="relative border-x col-span-9 pb-16 sm:mb-0 sm:col-span-7 sm:border-x md:col-span-7 md:border-x lg:col-span-5 lg:border-x xl:border-x">
          <Suspense>
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
              <Route
                exact={true}
                path="/explore"
                name="Explore"
                // fetchData={() => dispatch(route.fetchData())}
                element={
                  <ExploreProvider>
                    <LazyExplore />
                  </ExploreProvider>
                }
              >
                {exploreRoutes.map((route, idx) => (
                  <Route
                    key={idx}
                    exact={route.exact}
                    path={route.path}
                    name={route.name}
                    // fetchData={() => dispatch(route.fetchData())}
                    element={<route.component />}
                  />
                ))}
              </Route>
            </Routes>
          </Suspense>
        </div>
        <div className="hidden sm:col-span-2 lg:inline px-2 mt-2  overflow-x-hidden">
          <Widgets />
        </div>
      </div>
      {searchModal && <UserSearchContainer />}
      {tweetModal && <TweetModal closeModal={handleCloseTweetModal} />}
    </>
  );
};

export default AuthLayout;
