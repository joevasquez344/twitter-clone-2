import React from 'react'

const ExploreItem = ({ item }) => {
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

export default ExploreItem