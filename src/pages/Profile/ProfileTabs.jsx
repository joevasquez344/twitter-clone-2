import React from 'react'


const ProfileTabs = ({tabs, handleTabs}) => {
  return (
    <div className="items-center flex justify-evenly grid-cols-4">
    {tabs?.map((tab) => (
      <div
        key={tab.id}
        onClick={() => handleTabs(tab.id)}
        className={`w-full flex justify-center border-b ${
          tab.isActive ? "text-black-500" : "text-gray-500"
        } font-semibold py-4 hover:bg-gray-200 transition ease-in-out cursor-pointer duration-200 ${
          tab.isActive ? "border-b-4 border-blue-500" : ""
        }`}
      >
        {tab.text}
      </div>
    ))}
  </div>
  )
}

export default ProfileTabs