import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const { userData,serverUrl,setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogout =async () => {

    try{
       const result = await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials: true});
       setUserData(null);
       navigate("/signin");
  }
    catch(error){
      setUserData(null);
      console.log(error);
    }

 }

 



  return (
    <div
      className="w-full min-h-screen bg-gradient-to-t
      from-black to-[#02023d]
      flex flex-col items-center"
    >
      {/* Top Buttons */}
      <div className="w-full max-w-6xl flex justify-between items-center p-6">
        <button
          className="px-6 py-3 rounded-xl
          bg-cyan-500 hover:bg-cyan-400
          transition-all duration-300
          text-white font-semibold shadow-lg cursor-pointer"
        onClick={() => navigate("/customize")}>
          Customize Your Assistant
        </button>

        <button
          className="px-6 py-3 rounded-xl
          bg-red-500 hover:bg-red-400
          transition-all duration-300
          text-white font-semibold shadow-lg cursor-pointer"
          onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Assistant Image */}
      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        <div
          className="w-[300px] h-[400px]
          rounded-3xl overflow-hidden
          shadow-2xl border border-white/10"
        >
          <img
            src={userData?.assistantImage}
            alt={userData?.assistantName}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-white text-3xl font-bold">
          I'm{" "}
          <span className="text-cyan-400">
            {userData?.assistantName}
          </span>
        </h1>
      </div>
    </div>
  );
}

export default Home;