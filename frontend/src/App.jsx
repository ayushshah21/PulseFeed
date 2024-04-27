import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";
import Form from "./Form";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./LandingPage";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        navigate('/home');
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:5001/login";
  };

  // return (
  //   <div className="app-container">
  //     {user ? (
  //       <div className="authenticated-main">
  //         <div className="welcome-message">
  //           <h2>Welcome, {user.name.split(" ")[0]}!</h2>
  //         </div>
  //         <Form user={user} />
  //       </div>
  //     ) : (
  //       <div className='landing-page'>
  //       <div className='left-landing'>
  //           <h1 className='all-nba-title'>all-nba</h1>
  //           <h3 className='title-text'>Debate your most outrageous sports takes on All-NBA.</h3>
  //       </div>
  //       <div className='right-landing'>
  //           <SignInForm />
  //       </div>
  //   </div>
  //     )}
  //   </div>
  // );

  return (
      <Routes>
        <Route path="/" element={<LandingPage handleLogin={handleLogin}/>} />
        <Route path="/home" element={<Form user={user} />} />
      </Routes>
  )
}

export default App;


