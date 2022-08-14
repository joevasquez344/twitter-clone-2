import React, {useEffect} from 'react'

const Like = () => {

    useEffect(() => {
        console.log('LIKE RENDER')
    }, [])
    console.log('LIKE OUTER RENDER')
  return (
    <div>Like</div>
  )
}

export default Like