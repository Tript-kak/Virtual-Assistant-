import React, { useContext, useState } from "react";
import bg from "../assets/Authbg.png";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

function SignUp() {
  const navigate = useNavigate();

  
  const { serverUrl, setUserData } = useContext(userDataContext);

  
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(result);

     
      setUserData(result.data);

      setLoading(false);

      
      navigate("/signin");
 
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
     
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      
      <div
        className="relative z-10 w-full max-w-md 
        bg-white/10 backdrop-blur-xl 
        border border-white/20 
        rounded-3xl shadow-2xl p-8"
      >
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Create Account
          </h1>
          <p className="text-gray-300 mt-2">
            Join the future of AI
          </p>
        </div>

      
        {err && (
          <p className="text-red-400 text-sm text-center mb-4">
            {err}
          </p>
        )}

     
        <form onSubmit={handleSignUp} className="space-y-5">

         
          <div>
            <label className="text-gray-200 text-sm block mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl 
              bg-white/10 border border-white/20
              text-white placeholder-gray-400
              focus:outline-none focus:border-cyan-400"
            />
          </div>

        
          <div>
            <label className="text-gray-200 text-sm block mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl 
              bg-white/10 border border-white/20
              text-white placeholder-gray-400
              focus:outline-none focus:border-cyan-400"
            />
          </div>

          
          <div>
            <label className="text-gray-200 text-sm block mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl 
                bg-white/10 border border-white/20
                text-white placeholder-gray-400
                focus:outline-none focus:border-cyan-400"
              />

              <span
                className="absolute right-4 top-4 text-gray-300 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOff size={22} />
                ) : (
                  <IoEye size={22} />
                )}
              </span>
            </div>
          </div>

      
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl
            bg-cyan-500 hover:bg-cyan-400
            transition-all duration-300
            text-white font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        
        <p className="text-center text-gray-300 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-cyan-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;