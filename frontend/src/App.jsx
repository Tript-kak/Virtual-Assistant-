import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import Home from "./pages/Home";
import { userDataContext } from "./context/UserContext";

function App() {
  const { userData, loading } = useContext(userDataContext);

  // Wait until authentication check completes
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />

        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to="/signin" />}
        />

        <Route
          path="/customize2"
          element={userData ? <Customize2 /> : <Navigate to="/signin" />}
        />

        <Route
          path="/"
          element={
            !userData ? (
              <Navigate to="/signin" />
            ) : !userData.assistantImage || !userData.assistantName ? (
              <Navigate to="/customize" />
            ) : (
              <Home />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;