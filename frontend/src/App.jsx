import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./index.css";
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
    <>
      {user ? (
        <div className="main">
        <div className="welcome">
          {console.log(user)}
          <h2>Welcome, {user.name.split(" ")[0]}!</h2>
        </div>
        <div className="form">
          <Form user={user}/>
        </div>
        </div>
      ) : (
        <div>
          <h1>Welcome to PulseFeed</h1>
          <button
            style={{ backgroundColor: "lightgreen" }}
            onClick={handleLogin}
          >
            Get Started With Google
          </button>
        </div>
      )}
    </>
  );
}

export default App;
