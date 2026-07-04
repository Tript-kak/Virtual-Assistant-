import React , {useContext} from 'react'

import {userDataContext} from "../context/UserContext"


function Card({image}) {
    const { serverUrl,
    userData,
    setUserData,
    loading,
    backendImage,
    frontendImage,
    setBackendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
 } = useContext(userDataContext);

  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] boirder-2
    border-[blue] rounded-2xl overflow-hidden hover:shadow-2xl 
    hover: shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage == image?"border-white shadow-2xl":null}` }
    onClick={()=>{ 
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
      }} >
      <img src={image} className='h-full object-cover' />
    </div>

    
  )
}

export default Card
