import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { Route, Routes, useNavigate } from "react-router-dom";
import ExploreList from "./ExploreList";
import { exploreRoutes } from "../../routes";
import { forYouData } from "../../mock_data/explore.data";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("For You");
  const [forYouItems, setForYouItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch for you data
    setForYouItems(forYouData);
    setLoading(false);
  }, []);

  const forYouRoute = () => {
    setActiveTab("For You");
    navigate("/explore/tabs/for_you");
  };
  const trendingRoute = () => {};
  const newsRoute = () => {};
  const entertainmentRoute = () => {};

  return (
    <div className="">
      <div className="pb-1 pt-6 px-6 border-b">
        <input
          className="bg-gray-100 rounded-full p-3 w-full outline-none"
          type="text"
        />

        <div className="flex justify-between h-16 mt-1">
          <div
            onClick={forYouRoute}
            className="w-full px-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-600"
          >
            <div
              className={`h-full flex items-center justify-center whitespace-nowrap ${
                activeTab === "For You"
                  ? "font-bold border-b-blue-400 border-b-4"
                  : ""
              }`}
            >
              For You
            </div>
          </div>
          <div
            onClick={() => setActiveTab("Trending")}
            className="w-full px-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-600"
          >
            <div
              className={`h-full flex items-center justify-center whitespace-nowrap ${
                activeTab === "Trending"
                  ? "font-bold border-b-blue-400 border-b-4"
                  : ""
              }`}
            >
              Trending
            </div>
          </div>
          <div
            onClick={() => setActiveTab("News")}
            className="w-full px-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-600"
          >
            <div
              className={`h-full flex items-center justify-center whitespace-nowrap ${
                activeTab === "News"
                  ? "font-bold border-b-blue-400 border-b-4"
                  : ""
              }`}
            >
              News
            </div>
          </div>
          <div
            onClick={() => setActiveTab("Sports")}
            className="w-full px-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-600"
          >
            <div
              className={`h-full flex items-center justify-center whitespace-nowrap ${
                activeTab === "Sports"
                  ? "font-bold border-b-blue-400 border-b-4"
                  : ""
              }`}
            >
              Sports
            </div>
          </div>
          <div
            onClick={() => setActiveTab("Entertainment")}
            className="w-full px-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all duration-600"
          >
            <div
              className={`h-full flex items-center justify-center whitespace-nowrap ${
                activeTab === "Entertainment"
                  ? "font-bold border-b-blue-400 border-b-4"
                  : ""
              }`}
            >
              Entertainment
            </div>
          </div>
        </div>
      </div>

      {/* <Routes>
        {exploreRoutes.map((route, index) => (
          <Route
            key={index}
            exact={route.exact}
            path={route.path}
            name={route.name}
            // fetchData={() => dispatch(route.fetchData())}
            element={<route.component />}
          />
        ))}
      </Routes> */}

      {/* <Routes>
        <Route
          // key={idx}
          exact={true}
          path="/explore"
          name="For You"
          // fetchData={() => dispatch(route.fetchData())}
          element={<ExploreList items={forYouItems} />}
        />
      </Routes> */}

      {loading ? <Loader /> : <ExploreList items={forYouItems} />}
    </div>
  );
};

export default Explore;
