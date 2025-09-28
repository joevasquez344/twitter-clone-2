import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { forYouData } from "../../mock_data/explore.data";

export const ExploreContext = createContext();

export const useExplore = () => {
  return useContext(ExploreContext);
};

export const ExploreProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("For You");
  const [forYouItems, setForYouItems] = useState([]);

  const navigate = useNavigate();
  const endpoint = useLocation().pathname;

  const forYouRoute = () => {
    setActiveTab("For You");
    navigate("/explore/tabs/for_you");
  };
  const trendingRoute = () => {
    setActiveTab("Trending");
    navigate("/explore/tabs/trending");
  };
  const newsRoute = () => {
    setActiveTab("News");
    navigate("/explore/tabs/news");
  };
  const sportsRoute = () => {
    setActiveTab("Sports");
    navigate("/explore/tabs/sports");
  };
  const entertainmentRoute = () => {
    setActiveTab("Entertainment");
    navigate("/explore/tabs/entertainment");
  };

  const getForYou = () => {
    setForYouItems(forYouData);
  };

  const removeSlashFromEndpoint = (endpoint) => {
    let strToArr = endpoint.split("");
    strToArr.shift();
    let arrToStr = strToArr.join("");

    return arrToStr;
  };

  const capitalizeWord = (word) => {
    const firstLetter = word.charAt(0);
    const firstLetterCap = firstLetter.toUpperCase();

    const remainingLetters = word.slice(1);

    const capitalizedWord = firstLetterCap + remainingLetters;

    return capitalizedWord
  };

  const routeOnMount = (endpoint) => {
   const word = removeSlashFromEndpoint(endpoint)
   const capEndpoint = capitalizeWord(word)

    // let end = j.join(",")
    // // path.shift()
    // path.join();
    setActiveTab(capEndpoint)
    navigate(endpoint)
  };

  useEffect(() => {}, []);

  const value = {
    activeTab,
    forYouItems,
    routeOnMount,
    getForYou,
    forYouRoute,
    trendingRoute,
    newsRoute,
    sportsRoute,
    entertainmentRoute,
  };

  return (
    <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>
  );
};
