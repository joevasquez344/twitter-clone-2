import React from 'react'

const ExploreItem = ({ item }) => {
  return (
    <div className="">
      <div className="text-gray-500 flex items-center space-x-1">
        <div>{item?.genre}</div> <div className='h-1 w-1 rounded-full bg-gray-500'></div>
        <div>{item?.topic}</div>
      </div>
      <div className="">{item?.title}</div>
      <div className="text-gray-500">{item?.tweets}</div>
    </div>
  );
};

export default ExploreItem