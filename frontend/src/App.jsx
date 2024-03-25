import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./index.css"; // Ensure your CSS file includes the new styles
import Form from "./Form";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "http://localhost:5001/login";
  };

  return (
    <div className="app-container">
      {user ? (
        <div className="authenticated-main">
          <div className="welcome-message">
            <h2>Welcome, {user.name.split(" ")[0]}!</h2>
          </div>
          <Form user={user} />
        </div>
      ) : (
        <div className="login-screen">
          <h1>Welcome to PulseFeed</h1>
          <button className="login-button" onClick={handleLogin}>
            Get Started With Google
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
