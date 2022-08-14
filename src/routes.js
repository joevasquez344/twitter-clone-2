import {Route} from 'react-router-dom'

import Landing from './pages/Landing';
import Home from "./pages/Home";
import TweetDetails from "./pages/TweetDetails";
import Profile from "./pages/Profile";
import Modal from './components/Modal';

const routes = [
    // TODO: move new routes to separate section
    {
      path: '/home',
      exact: true,
      component: Home,
      name: 'Home',
      private: true,
    },
    {
      path: '/:username/status/:tweetId',
      exact: false,
      name: 'Tweet Details',
      component: TweetDetails,
      private: true
    },
    {
      path: '/:username',
      exact: true,
      name: 'Profile',
      component: Profile,
      private: false
    },
    // {   path: "/CreateNewPlan",   exact: true,   name: "NewPlan", component:
    // NewPlan, },
   
  ];

export default routes