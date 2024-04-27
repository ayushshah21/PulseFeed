/* eslint-disable react/prop-types */
import { useState } from 'react';
import { supabase } from "./client.js";
import { useNavigate } from 'react-router-dom';

const SignInForm = ({handleLogin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isSigningUp ? 'Signing Up' : 'Signing In';
    console.log(action, email);

    if (isSigningUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
        setShowModal(true);
      } else if (data) {
        setMessage('Please check your email to verify your account.');
        setShowModal(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setShowModal(true);
      } else {
        navigate('/home');
      }
    }
  };

  return (
    <div className="login-form-container">
      {showModal && (
        <div className="modal">
          <p>{message}</p>
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" placeholder="Email" required />
        </div>
        <div className="input-group">
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Password" required />
        </div>
        <button onClick={() => setIsSigningUp(false)} type="submit" className="login-btn">Log In</button>
        <a href="#" className="forgot-password">Forgot password?</a>
        <button onClick={() => setIsSigningUp(true)} type="submit" className="create-account-btn">Create new account</button>
        <button className="login-button" onClick={handleLogin}>
            Get Started With Google
          </button>
      </form>
    </div>
  );
};

export default SignInForm;
