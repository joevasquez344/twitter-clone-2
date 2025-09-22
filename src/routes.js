import { Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home";
import TweetDetails from "./pages/TweetDetails/TweetDetails";
import Profile from "./pages/Profile/Profile";
import Profile2 from "./pages/Profile/Profile2";
import FollowersAndFollowing from "./pages/FollowersAndFollowing";
import Bookmarks from "./pages/Bookmarks";
import PostDetails from "./pages/PostDetails";
import { getPosts } from "./redux/home/home.actions";
import Explore from "./pages/Explore/Explore";

const routes = [
  // TODO: move new routes to separate section
  {
    path: "/home",
    exact: true,
    component: Home,
    name: "Home",
    fetchData: getPosts,
    private: true,
  },
  {
    path: "/:username/status/:tweetId",
    exact: false,
    name: "Tweet Details",
    component: TweetDetails,
    // component: PostDetails,
    private: true,
  },
  {
    path: "/:username",
    exact: true,
    name: "Profile",
    component: Profile,
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
    component: FollowersAndFollowing,
    private: false,
  },
  {
    path: "/:username/following",
    exact: true,
    name: "Following",
    component: FollowersAndFollowing,
    private: false,
  },
  {
    path: "/bookmarks",
    exact: true,
    name: "Bookmarks",
    component: Bookmarks,
    private: true,
  },
  {
    path: "/explore",
    exact: true,
    name: "Explore",
    component: Explore,
    private: true,
  },


  // {   path: "/CreateNewPlan",   exact: true,   name: "NewPlan", component:
  // NewPlan, },
];

export default routes;
