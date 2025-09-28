import React from 'react'
import { useExplore } from './ExploreContext'

const ExploreTabs = ({}) => {
    const {forYouRoute, trendingRoute, newsRoute, sportsRoute, entertainmentRoute, activeTab} = useExplore();
  return (
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
            onClick={trendingRoute}
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
            onClick={newsRoute}
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
            onClick={sportsRoute}
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
            onClick={entertainmentRoute}
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
  )
}

export default ExploreTabs