import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Customize2() {
  const navigate = useNavigate();

  const { userData, setUserData } = useContext(userDataContext);

  const {
    backendImage,
    frontendImage,
    serverUrl,
    setBackendImage,
    setFrontendImage,
    selectedImage,
  } = useContext(userDataContext);

  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();

      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/upload`,
        formData,
        { withCredentials: true }
      );

      console.log(result.data);
      setUserData(result.data);

      // Navigate after successful update (optional)
      // navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-t
      from-black to-blue-950 flex flex-col justify-center
      items-center p-5"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/customize")}
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

      <input
        type="text"
        placeholder="eg. tobi"
        className="w-full max-w-[600px]
        h-[60px] outline-none border-2 border-white
        bg-transparent text-white placeholder-gray-300
        px-[20px] py-[10px] rounded-full text-[18px]"
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName.length > 0 && (
        <button
          onClick={handleUpdateAssistant}
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
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize2;