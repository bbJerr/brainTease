import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Trivia from "./components/Trivia/Trivia";
import AuthPage from "./components/Auth/Auth";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import Background from "./components/Background/Background";
import "./App.css";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or any loading component.
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Background />
        <Routes>
          <Route path="/auth" element={<AuthPage setIsAuth={setIsAuth} />} />
          <Route
            path="/trivia"
            element={isAuth ? <Trivia /> : <Navigate to="/auth" />}
          />
          <Route
            path="/leaderboard"
            element={isAuth ? <Leaderboard /> : <Navigate to="/auth" />}
          />
          <Route
            path="*"
            element={<Navigate to={isAuth ? "/trivia" : "/auth"} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
