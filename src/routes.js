import { Route } from "react-router-dom";
import { lazy } from "react";

import Landing from "./pages/Landing/Landing";
// import Home from "./pages/Home";
// import TweetDetails from "./pages/TweetDetails/TweetDetails";
// import Profile from "./pages/Profile/Profile";
// import FollowersAndFollowing from "./pages/FollowersAndFollowing";
// import Bookmarks from "./pages/Bookmarks";
// import Explore from "./pages/Explore/Explore";

import { getPosts } from "./redux/home/home.actions";
import ExploreList from "./pages/Explore/ExploreList";

const LazyHome = lazy(() => import("./pages/Home"));
const LazyHome2  = lazy(() => import("./pages/Home2"));

const LazyTweetDetails = lazy(() =>
  import("./pages/TweetDetails/TweetDetails")
);
const LazyProfile = lazy(() => import("./pages/Profile/Profile"));
const LazyFollowersAndFollowing = lazy(() =>
  import("./pages/FollowersAndFollowing")
);
const LazyBookmarks = lazy(() => import("./pages/Bookmarks"));
export const LazyExplore = lazy(() => import("./pages/Explore/Explore"));

export const routes = [
  // TODO: move new routes to separate section
  {
    path: "/home",
    exact: true,
    component: LazyHome2,
    name: "Home",
    fetchData: getPosts,
    private: true,
  },
  {
    path: "/:username/status/:tweetId",
    exact: false,
    name: "Tweet Details",
    component: LazyTweetDetails,
    // component: PostDetails,
    private: true,
  },
  {
    path: "/:username",
    exact: true,
    name: "Profile",
    component: LazyProfile,
    private: false,
  },
  // {
  //   path: "/:username/with_replies",
  //   exact: true,
  //   name: "Profile",
  //   component: Profile,
  //   private: false,
  // },
  // {
  //   path: "/:username/media",
  //   exact: true,
  //   name: "Profile",
  //   component: Profile,
  //   private: false,
  // },
  // {
  //   path: "/:username/likes",
  //   exact: true,
  //   name: "Profile",
  //   component: Profile,
  //   private: false,
  // },
  {
    path: "/:username/followers",
    exact: true,
    name: "Followers",
    component: LazyFollowersAndFollowing,
    private: false,
  },
  {
    path: "/:username/following",
    exact: true,
    name: "Following",
    component: LazyFollowersAndFollowing,
    private: false,
  },
  {
    path: "/bookmarks",
    exact: true,
    name: "Bookmarks",
    component: LazyBookmarks,
    private: true,
  },

  // {   path: "/CreateNewPlan",   exact: true,   name: "NewPlan", component:
  // NewPlan, },
];

export const exploreRoutes = [
  {
    path: "/explore/tabs/for_you",
    exact: true,
    name: "For You",
    component: ExploreList,
    private: true,
  },
  {
    path: "/explore/tabs/trending",
    exact: true,
    name: "Trending",
    component: ExploreList,
    private: true,
  },
  {
    path: "/explore/tabs/news",
    exact: true,
    name: "News",
    component: ExploreList,
    private: true,
  },
  {
    path: "/explore/tabs/Sports",
    exact: true,
    name: "Sports",
    component: ExploreList,
    private: true,
  },
  {
    path: "/explore/tabs/entertainment",
    exact: true,
    name: "Entertainment",
    component: ExploreList,
    private: true,
  },
];
