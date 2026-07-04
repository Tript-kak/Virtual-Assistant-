import React, { useRef, useState, useContext } from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/Authbg.png";

import { userDataContext } from "../context/UserContext";

import { LuImagePlus } from "react-icons/lu";
import { IoArrowBack } from "react-icons/io5";

function Customize() {
  const navigate = useNavigate();

  const {
    serverUrl,
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

  const inputImage = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-t from-black to-blue-950
      flex flex-col justify-center items-center p-5"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 w-12 h-12 rounded-full
        bg-white/10 hover:bg-white/20 text-white
        flex justify-center items-center transition-all duration-300"
      >
        <IoArrowBack className="text-2xl" />
      </button>

      <h1 className="text-white text-3xl text-center mb-10">
        Select your{" "}
        <span className="text-blue-200">Assistant Image</span>
      </h1>

      <div
        className="w-full max-w-[900px]
        flex justify-center items-center
        flex-wrap gap-4"
      >
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />

        {/* Upload Card */}
        <div
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
          className="
          w-[70px] h-[140px]
          lg:w-[150px] lg:h-[250px]
          bg-[#030326]
          border-2 border-blue-500
          rounded-2xl
          overflow-hidden
          cursor-pointer
          hover:border-white
          hover:shadow-2xl
          hover:shadow-blue-900
          transition-all duration-300
          flex justify-center items-center
          "
        >
          {!frontendImage ? (
            <LuImagePlus className="text-white text-3xl" />
          ) : (
            <img
              src={frontendImage}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          onChange={handleImage}
          hidden
        />
      </div>

      {selectedImage && (
        <button
          className="
          min-w-[150px]
          h-[60px]
          mt-8
          bg-white
          text-black
          font-semibold
          rounded-full
          text-lg
          hover:bg-gray-200
          transition-all
          duration-300
          cursor-pointer
          "
          onClick={() => {
            navigate("/customize2");
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;