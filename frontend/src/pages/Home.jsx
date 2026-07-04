import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../assets/ai.gif";
import userImg from "../assets/user.gif";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);

  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const navigate = useNavigate();

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);

  const handleLogout = useCallback(async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setUserData(null);
      navigate("/signin");
    }
  }, [serverUrl, setUserData, navigate]);

  const speak = useCallback((text) => {
    if (!text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const openInNewTab = (url) => window.open(url, "_blank", "noopener,noreferrer");

  const handleCommand = useCallback(
    (data) => {
      const { type, userInput, response } = data;
      speak(response);

      const searchUrl = (base) => `${base}${encodeURIComponent(userInput)}`;

      switch (type) {
        case "google_search":
          openInNewTab(searchUrl("https://www.google.com/search?q="));
          break;

        case "youtube_search":
        case "youtube_play":
          openInNewTab(searchUrl("https://www.youtube.com/results?search_query="));
          break;

        case "calculator_open":
          window.open("calculator://");
          break;

        case "instagram_open":
          openInNewTab("https://www.instagram.com");
          break;

        case "facebook_open":
          openInNewTab("https://www.facebook.com");
          break;

        case "spotify_open":
          openInNewTab("https://open.spotify.com");
          break;

        case "gmail_open":
          openInNewTab("https://mail.google.com");
          break;

        case "maps_open":
          openInNewTab("https://maps.google.com");
          break;

        case "website_open": {
          let website = userInput.trim().toLowerCase().replace(/^open\s+/, "");
          openInNewTab(website.startsWith("http") ? website : `https://${website}.com`);
          break;
        }

        case "weather_show":
          openInNewTab(searchUrl("https://www.google.com/search?q=weather+"));
          break;

        case "get_time":
        case "get_date":
        case "get_day":
        case "get_month":
        case "general":
          break;

        default:
          speak("Sorry, I couldn't understand your request.");
      }
    },
    [speak]
  );

  useEffect(() => {
    if (!userData?.assistantName) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    let isMounted = true;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    const escapedName = userData.assistantName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const nameRegex = new RegExp(escapedName, "i");

    recognition.onstart = () => console.log("Listening...");

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("");
        setUserText(transcript);

        try {
          const cleanTranscript = transcript.replace(nameRegex, "").trim();
          const data = await getGeminiResponse(cleanTranscript);

          if (!isMounted) return;

          setAiText(data.response);
          setUserText("");
          handleCommand(data);
        } catch (err) {
          console.log(err);
        }
      }
    };

    recognition.onerror = (e) => {
      console.log("Speech Error:", e.error);
    };

    recognition.onend = () => {
      if (isMounted) {
        try {
          recognition.start();
        } catch (err) {
          console.log("Restart failed:", err);
        }
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.log("Initial start failed:", err);
    }

    return () => {
      isMounted = false;
      recognition.onend = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.stop();
      window.speechSynthesis.cancel();
    };
  }, [userData?.assistantName, getGeminiResponse, handleCommand]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-[#020225] to-[#02023d] flex flex-col items-center px-4 sm:px-6 py-4 overflow-x-hidden">
      {/* Top Bar */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 py-4">
        <button
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl
          bg-cyan-500 hover:bg-cyan-400 active:scale-95
          transition-all duration-200
          text-white text-sm sm:text-base font-semibold shadow-lg shadow-cyan-500/20 cursor-pointer"
          onClick={() => navigate("/customize")}
        >
          Customize Your Assistant
        </button>

        <button
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl
          bg-red-500 hover:bg-red-400 active:scale-95
          transition-all duration-200
          text-white text-sm sm:text-base font-semibold shadow-lg shadow-red-500/20 cursor-pointer"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      
      <div className="flex-1 w-full flex flex-col justify-center items-center gap-6 py-8 max-w-md mx-auto text-center">
        <div
          className="w-full max-w-[280px] aspect-[3/4] sm:max-w-[300px]
          rounded-3xl overflow-hidden
          shadow-2xl shadow-black/40 border border-white/10
          bg-white/5"
        >
          <img
            src={userData?.assistantImage}
            alt={userData?.assistantName}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">
          I'm <span className="text-cyan-400">{userData?.assistantName}</span>
        </h1>

        <img
          src={aiText ? ai : userImg}
          alt=""
          className="w-[150px] sm:w-[200px] transition-opacity duration-300"
        />

        <h1 className='text-white text-[18px] font-bold text-2xl ' >
          {userText || aiText || null}
        </h1>
      </div>
    </div>
  );
}

export default Home;