import React, { useContext, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const {
    userData,
    serverUrl,
    setUserData,
    getGeminiResponse,
  } = useContext(userDataContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  useEffect(() => {
    if (!userData?.assistantName) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("🎤 Listening...");
    };

    recognition.onresult = async (e) => {
      const transcript =
        e.results[e.results.length - 1][0].transcript.trim();

      console.log("Transcript:", transcript);
      console.log("Assistant:", userData.assistantName);

      if (
        transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase())
      ) {
        console.log("Assistant name detected");

        try {
          const cleanTranscript = transcript
            .replace(
              new RegExp(userData.assistantName, "i"),
              ""
            )
            .trim();

          const data = await getGeminiResponse(cleanTranscript);

          console.log("Gemini Response:", data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    recognition.onerror = (e) => {
      console.log("Speech Error:", e.error);
    };

    recognition.onend = () => {
      console.log("Restarting recognition...");
      recognition.start();
    };

    recognition.start();

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, [userData, getGeminiResponse]);

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
          onClick={() => navigate("/customize")}
        >
          Customize Your Assistant
        </button>

        <button
          className="px-6 py-3 rounded-xl
          bg-red-500 hover:bg-red-400
          transition-all duration-300
          text-white font-semibold shadow-lg cursor-pointer"
          onClick={handleLogout}
        >
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