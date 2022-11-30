import React from 'react'
import ArrowButton from '../../components/Buttons/ArrowButton'

const ProfileHeader = ({profile, profilePostsCount}) => {
  return (
    <div className="z-40 sticky top-0 bg-white px-5 py-2 flex items-center">
              <div className="mr-8">
                <ArrowButton />
              </div>
              <div>
                <div className="text-xl font-bold">{profile.name}</div>
                <div className="text-sm text-gray-500">
                  {profilePostsCount} Tweets
                </div>
              </div>
            </div>
  )
}

export default ProfileHeader