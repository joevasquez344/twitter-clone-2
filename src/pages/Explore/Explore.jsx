import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("For You");
  const [forYouData, setForYouData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch for you data
    setForYouData(forYouItems);
    setLoading(false);
  }, []);

  const forYouRoute = () => {};
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
            onClick={() => setActiveTab("For You")}
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

      {loading ? (
        <Loader />
      ) : (
        <div className="m-6 flex flex-col space-y-6">
          {forYouData.map((item) => (
            <Item item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;

const Item = ({ item }) => {
  return (
    <div className="">
      <div className="text-gray-500">
        <span>{item.genre}</span> <span>.</span>
        <span>{item.topic}</span>
      </div>
      <div className="">{item.title}</div>
      <div className="text-gray-500">{item.tweets}</div>
    </div>
  );
};

const forYouItems = () => [
  {
    id: 1,
    genre: "Sports",
    topic: "Trending in Sports",
    title: "NBA Finals",
    tweets: "1.2K Tweets",
  },
  {
    id: 2,
    genre: "Entertainment",
    topic: "Trending in Entertainment",
    title: "The Weeknd",
    tweets: "3,400 Tweets",
  },
  {
    id: 3,
    genre: "News",
    topic: "Trending in News",
    title: "Ukraine",
    tweets: "12.3K Tweets",
  },
  {
    id: 4,
    genre: "Sports",
    topic: "Trending in Sports",
    title: "World Cup",
    tweets: "5,400 Tweets",
  },
  {
    id: 5,
    genre: "Entertainment",
    topic: "Trending in Entertainment",
    title: "Oscars",
    tweets: "2,300 Tweets",
  },
];
